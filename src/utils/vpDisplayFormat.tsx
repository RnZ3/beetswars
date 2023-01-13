export function vpDisplayFormat(num: any, digits: any) {
  var units = ["k", "M", "G", "T", "P", "E", "Z", "Y"], decimal;
  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);
    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    } 
  }
  return num;
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export function abbreviateNumber(number:number){

  if (number) {
    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier === 0) return number.toFixed(0);

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(2) + suffix;
  }
  return 0
}
