---
layout: blog
title: Bearded Dragon Owners Blog
---

<!-- Blog Feed -->
<h1>{{page.title}}</h1>
<div class="blog-feed">
    {% for post in site.posts %}
        <div class="post-thumbnail">
            <!-- Title of post with link -->
            <div class="post-title"><a href="{{post.url}}"><h2>{{post.title}}</h2></a></div>
            <!-- Image of post with link -->
            <a href="/{{post.url}}">{{post.image}}</a>
            <!-- Author of post and date when created -->
            <div class="post-author-and-date">
                <!-- Author and date -->
                <p><i class="lar la-user"></i> {{post.author}}</p>
                <p><i class="las la-clock"></i> {{ post.date | date: "%m/%d/%Y" }}</p>
            </div>
            <!-- Description of post -->
            <p class="post-description">{{post.description}}</p>
            <!-- Keep reading -->
            <a class="cta-link" href="{{post.url}}">Continue Reading</a>
        </div>
    {% endfor %}
</div>