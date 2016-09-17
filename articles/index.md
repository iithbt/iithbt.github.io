---
layout: home_page
title: Articles
excerpt: "An archive of articles sorted by date."
search_omit: true
---

<ul class="post-list">
{% for post in site.posts limit:10 %}
  <li style="height:270px;"><article>
  <div class="post-thumb" style="{% assign loopindex = forloop.index | modulo: 2 %}{% if loopindex == 1 %}float:left;{%else %}float:right;{% endif %}"><img {% if post.image.feature %}src="{{ site.url }}/images/{{ post.image.feature }}" {% else %}src="{{ site.url }}/images/site-logo.png"{% endif %} height="100%" width="100%" alt="{{ post.title }}"></div>
  <div class="post-content" style="{% assign loopindex = forloop.index | modulo: 2 %}{% if loopindex == 1 %}float:right;{%else %}float:left;{% endif %}">
  <a href="{{ site.url }}{{ post.url }}"><div class="post-title">{{ post.title }}</div> <div><span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time></span><span class="entry-author">{% if post.author %} - {{ site.data.authors[post.author].name }}{% endif %}</span></div>{% if post.excerpt %} <p>{{ post.excerpt | remove: '\[ ... \]' | remove: '\( ... \)' | markdownify | strip_html | strip_newlines | escape_once }}</p>{% endif %}</a></div>
  </article></li>
{% endfor %}
</ul>
