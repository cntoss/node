/* var rect = {
    perimeter : (x,y) => (2*(x+y)),
    area : (x,y) => x*y
} */

var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Calculating ractangle from import having l= " + l +' and b = ',b);
    rect(l,b, (err, rectangle) => {
        if(err) {
            console.log("ERROR ", err.message);
        } else {
            console.log("area of rectangle havign l = " + l + 'and b = '+ b  + rectangle.area());
            console.log("perimeter of rectangle havign l = " + l + 'and b = '+ b  + rectangle.perimeter());
        }
    });

    console.log('This statements will called after 2 seconds delay');
}


solveRect(3,5);
solveRect(0,6);
solveRect(6,-9);


/* function solveRect(l,b) {
    console.log("Calculating ractangle from import having l= " +l+' and b = ',b);
    if(l <= 0 || b <=0) {
        console.log('Length and breadth of rectangle must be greater then Zero l= ' + l + " And b = " + b);
    } else {
        console.log('Perimeter of rectangle is ' + rect.perimeter(l,b));
    }
} */