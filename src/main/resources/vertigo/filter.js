var filter = {}

filter.FieldFilter = function(fieldName, value) {
  this.__jfilter = new net.kuujo.vertigo.filter.FieldFilter(fieldName, map_value(value));
}

filter.SourceFilter = function(source) {
  this.__jfilter = new net.kuujo.vertigo.filter.SourceFilter(source);
}

filter.TagsFilter = function(tags) {
  this.__jfilter = new net.kuujo.vertigo.filter.TagsFilter(tags);
}

module.exports = filter;
