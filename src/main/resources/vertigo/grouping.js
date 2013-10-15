var grouping = {}

grouping.RandomGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.RandomGrouping();
}

grouping.RoundGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.RoundGrouping();
}

grouping.FieldsGrouping = function(field) {
  this.__jgrouping = new net.kuujo.vertigo.grouping.FieldsGrouping(field);
}

grouping.AllGrouping = function() {
  this.__jgrouping = new net.kuujo.vertigo.grouping.AllGrouping();
}

module.exports = grouping;
