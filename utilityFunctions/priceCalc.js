const priceCalc = (price, dates) => {
    let cost = price[0] * dates.length;
    //Iterate along the recorded prices.
    if (price.length > 1) {
        cost = dates.reduce((acc, date, index) => {
            return acc + price[index];
        }, 0);
    }
    return (cost * 1.13).toFixed(2);
};

module.exports = priceCalc;
