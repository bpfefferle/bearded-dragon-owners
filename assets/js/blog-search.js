const blogSearch = document.querySelector('#blog-search');
const blogSearchParams = new URLSearchParams(window.location.search);
const blogQuery = (blogSearchParams.get('q') ?? '').trim();
const commonTitleWords = new Set(['a', 'an', 'and', 'for', 'how', 'is', 'of', 'the', 'to', 'what', 'why', 'your']);
const relatedTitleWords = [
    ['diet', 'feed', 'feeding', 'food', 'nutrition', 'eat', 'eating', 'vegetable', 'vegetables'],
    ['hydrate', 'hydration', 'water', 'drinking'],
    ['cohabitation', 'cohabit', 'cohabiting']
];

function titleWords(text) {
    return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function titleMatchScore(title, queryWords, keywords) {
    const words = titleWords(title);
    const phraseMatch = ` ${words.join(' ')} `.includes(` ${queryWords.join(' ')} `);
    let score = phraseMatch ? 4 : 0;

    for (const term of keywords) {
        if (words.includes(term)) {
            score += 3;
        } else if (term.length >= 3 && words.some(word => word.startsWith(term))) {
            score += 2;
        } else if (relatedTitleWords.some(group => group.includes(term) && words.some(word => group.includes(word)))) {
            score += 1;
        }
    }
    return score;
}

function searchPageControl(label, page, totalPages) {
    const available = page >= 1 && page <= totalPages;
    const control = document.createElement(available ? 'a' : 'span');
    control.className = 'cta-link';
    control.textContent = label;

    if (available) {
        const url = new URL(blogSearch.action);
        url.searchParams.set('q', blogQuery);
        if (page > 1) url.searchParams.set('page', page);
        control.href = url.href;
    }
    return control;
}

blogSearch.hidden = false;

if (blogQuery) {
    const queryWords = titleWords(blogQuery);
    const significantWords = queryWords.filter(word => !commonTitleWords.has(word));
    const keywords = significantWords.length ? significantWords : queryWords;
    const catalog = document.querySelector('#blog-post-catalog');
    const posts = Array.from(catalog.content.children, card => ({
        card,
        score: keywords.length ? titleMatchScore(card.querySelector('.post-title h2').textContent, queryWords, keywords) : 0
    }));
    posts.sort((left, right) => right.score - left.score);

    const pageSize = Number(catalog.dataset.pageSize);
    const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
    const requestedPage = Number(blogSearchParams.get('page'));
    const currentPage = Number.isInteger(requestedPage) ? Math.min(totalPages, Math.max(1, requestedPage)) : 1;
    const start = (currentPage - 1) * pageSize;
    const visibleCards = posts.slice(start, start + pageSize).map(({ card }) => card.cloneNode(true));
    document.querySelector('#blog-posts').replaceChildren(...visibleCards);

    const pagination = document.querySelector('.pagination');
    pagination.querySelector('.page-number').textContent = `${currentPage} of ${totalPages}`;
    pagination.querySelector('.prev').replaceChildren(searchPageControl('Previous', currentPage - 1, totalPages));
    pagination.querySelector('.next').replaceChildren(searchPageControl('Next', currentPage + 1, totalPages));

    blogSearch.elements.q.value = blogQuery;
    const status = document.querySelector('#blog-search-status');
    const matches = posts.filter(({ score }) => score > 0).length;
    const matchLabel = matches === 1 ? 'post' : 'posts';
    status.querySelector('[role="status"]').textContent = matches
        ? `${matches} matching ${matchLabel} shown first.`
        : 'No matching titles. Showing all posts.';
    status.hidden = false;
}
