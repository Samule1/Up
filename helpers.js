"use strict"
module.exports = {
  getRandomId5: function(){
    let cars = "abcdefghijklmopqrstuvWxyzABCDEFGHIJKLMOPQRSTUVWXYZ0123456789"
    let out = "";
    let c;
    for(let i = 0; i<6; i++){
    	c = cars[Math.floor(Math.random()* cars.length)];
    	out = out +c
    }
    return out;
  }
}
