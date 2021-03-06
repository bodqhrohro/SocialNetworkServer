define(['views/base/view', 'text!templates/site.hbs'], function(View, template) {
  'use strict';

  var SiteView = View.extend({
    container: 'body',
    containerMethod: 'html',
    id: 'site-container',
    regions: {
      sidebar: '#sidebar',
      content: '#content'
    },
    template: template
  });

  return SiteView;
});
