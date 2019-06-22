module.exports = function (item) {

  function _isUnitGrams() {
    return item.servingSizeUnit === 'grams';
  }

  function _isUnitOunces() {
    return item.servingSizeUnit === 'ounces';
  }

  function _isUnitCups() {
    return item.servingSizeUnit === 'cups';
  }

  function _isUnitTablespoons() {
    return item.servingSizeUnit === 'tablespoons';
  }

  function _isUnitTeaspoons() {
    return item.servingSizeUnit === 'teaspoons';
  }

  function _isUnitLiters() {
    return item.servingSizeUnit === 'liters';
  }

  function _isUnitPieces() {
    return item.servingSizeUnit === 'pieces';
  }

  function _shortDate(date) {
    return new Date(date).toDateString();
  }

  return {
    id: item.id,
    brand: item.brand,
    name: item.name,
    servingSize: item.servingSize,
    servingSizeUnit: item.servingSizeUnit,
    servingSizeWeight: item.servingSizeWeight,
    carbs: item.carbs,
    sugars: item.sugars,
    protein: item.protein,
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    updatedAtDate: _shortDate(item.updatedAt),
    isUnitGrams: _isUnitGrams,
    isUnitOunces: _isUnitOunces,
    isUnitCups: _isUnitCups,
    isUnitTablespoons: _isUnitTablespoons,
    isUnitTeaspoons: _isUnitTeaspoons,
    isUnitLiters: _isUnitLiters,
    isUnitPieces: _isUnitPieces
  };
};
