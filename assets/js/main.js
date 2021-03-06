/* eslint-env es6 */
const BASE_FIREFLY_COUNT = 0;

const BASE_JAR_COUNT = 0;
const BASE_JAR_PRICE = 20;

const BASE_NET_COUNT = 0;
const BASE_NET_PRICE = 1000;

const BASE_HATCHERY_COUNT = 0;
const BASE_HATCHERY_PRICE = 25000;

const BASE_GLOWWORMS_PRICE =    200000;   // 100k
const BASE_ANGLERFISH_PRICE = 10000000;


// These constants will be used for the buy() function
// to check which item is being bought by comparing
// the passed-in parameter to these values.
const JAR = 1;
const NET = 2;
const HATCHERY = 3;
const GLOWWORMS = 4;
const ANGLERFISH = 5;


const BASE_JAR_REWARD = 1;
const BASE_NET_REWARD = 10;
const BASE_HATCHERY_REWARD = 100;



var firefly_count = BASE_FIREFLY_COUNT;

// max_flies is the num of flies at which
// you reach maximum brightness.
// start at 100k
// then 10M for glowworms
// then 1B for anglerfish
var max_flies = 100000; 

var jar_count = BASE_JAR_COUNT;
var jar_price = BASE_JAR_PRICE;

var net_count = BASE_NET_COUNT;
var net_price = BASE_NET_PRICE;

var hatchery_count = BASE_HATCHERY_COUNT;
var hatchery_price = BASE_HATCHERY_PRICE;

var hasGlowworms = 0; // use 0 and 1 because true and false is a headache to get to work (i.e., can't get it to work!)
var hasAnglerfish = 0; // localStorage doesn't save booleans, so just use 0 and 1


// This will hold the values when each upgrade will appear and be available
// [0] = glow worms  = 100,000
// [1] = angler fish = 1,000,000
var upgrade_starting_values = [BASE_GLOWWORMS_PRICE,
                               BASE_ANGLERFISH_PRICE];
var upgrade_names = ["glowworms", "anglerfish"];






function calculate_reward(seconds) {
    
    let new_flies =     1 * jar_count
                    +  10 * net_count
                    + 100 * hatchery_count;
    
    let reward;
    
    
    if(hasAnglerfish == 1 && hasGlowworms == 1)
        reward = Math.pow(Math.pow(new_flies, 1.2), 1.2) * seconds;
    
    else if(hasGlowworms == 1 || hasAnglerfish == 1) 
        reward = Math.pow(new_flies, 1.2) * seconds;
    
    else
        reward = new_flies * seconds;
    
    return reward;
}


function calculate_building_reward(building) {
    
    let reward = 1;
    let total_reward = calculate_reward(1); // 1 second of game time
    
    let building_contribution;
    let total_contribution;
    
    total_contribution =  BASE_JAR_REWARD * jar_count
                        + BASE_NET_REWARD * net_count
                        + BASE_HATCHERY_REWARD * hatchery_count;
    
    if (building == "JAR")
        building_contribution = BASE_JAR_REWARD * jar_count;
    else if (building == "NET")
        building_contribution = BASE_NET_REWARD * net_count;
    else if (building == "HATCHERY")
        building_contribution = BASE_HATCHERY_REWARD * hatchery_count;
    
    let proportion = building_contribution / total_contribution;
    
    let proportion_of_total_reward = proportion * total_reward;
    
    if (building == "JAR")
        return proportion_of_total_reward / jar_count;
    else if (building == "NET")
        return proportion_of_total_reward / net_count;
    else if (building == "HATCHERY")
        return proportion_of_total_reward / hatchery_count;
    
    return reward;
}




function format_value(num) {
    // Input:  number 
    // output: string

    num = Math.floor(num);

    if (num >= 1000 && num < 10000) {
        let numString = String(num);
        return numString.substring(0, 1) + "," + numString.substring(1);
    } else if (num >= 10000 && num < 100000) {
        let numString = String(num);
        return numString.substring(0, 2) + "," + numString.substring(2);
    } else if (num >= 100000 && num < 1000000) {
        return String(Math.floor(num / 1000)) + "K";
    } else if (num >= 1000000) {
        return String(Math.floor(num / 100000) / 10) + "M";
    } else if (num >= 1000000000) {
        return String(Math.floor(num / 100000000) / 10) + "B";
    }
    else {
        return String(num);
    }
}




function save() {

    if (isNaN(firefly_count) || isNaN(jar_count) || isNaN(jar_price) ||
        firefly_count == null || jar_count == null || jar_price == null) {
        // don't save
    } else {
        localStorage.setItem("firefly_count", firefly_count);
        localStorage.setItem("jar_count", jar_count);
        localStorage.setItem("jar_price", jar_price);
        
        localStorage.setItem("net_count", net_count);
        localStorage.setItem("net_price", net_price);

        localStorage.setItem("hatchery_count", hatchery_count);
        localStorage.setItem("hatchery_price", hatchery_price);
        
        
        // Save upgrade states
        localStorage.setItem("hasGlowworms", hasGlowworms);
        localStorage.setItem("hasAnglerfish", hasAnglerfish);
    }
}



function load() {
    
    var temp = parseInt(localStorage.getItem("firefly_count"));
    if (!isNaN(temp)) {
        firefly_count = temp;
    }

    temp = parseInt(localStorage.getItem("jar_count"));
    if (!isNaN(temp)) {
        jar_count = temp;
    }

    temp = parseInt(localStorage.getItem("jar_price"));
    if (!isNaN(temp)) {
        jar_price = temp;
    }
    
    
    temp = parseInt(localStorage.getItem("net_count"));
    if (!isNaN(temp)) {
        net_count = temp;
    }

    temp = parseInt(localStorage.getItem("net_price"));
    if (!isNaN(temp)) {
        net_price = temp;
    }
    

    temp = parseInt(localStorage.getItem("hatchery_count"));
    if (!isNaN(temp)) {
        hatchery_count = temp;
    }

    temp = parseInt(localStorage.getItem("hatchery_price"));
    if (!isNaN(temp)) {
        hatchery_price = temp;
    }
    
    // LOAD FIREFLIES
    if (isNaN(firefly_count) || firefly_count === null) {
        // do nothing
    } else {
        let counter = document.getElementById("firefly_counter");
        counter.value = format_value(firefly_count);
        document.title = "Emberfly, Inc. : " + firefly_count + " fireflies";
        update_width(counter);
    }
    
    // LOAD JARS
    if (isNaN(jar_count) || jar_count === null || isNaN(jar_price) || jar_price === null) {
        // do nothing
    } else {
        let counter = document.getElementById("jar_counter");
        let price_counter = document.getElementById("jar_price");
        counter.value = jar_count;
        price_counter.value = jar_price;
        update_width(counter);
        update_width(price_counter);
    }
    
    
    // LOAD NETS
    if (isNaN(net_count) || net_count === null || isNaN(net_price) || net_price === null) {
        // do nothing
    } else {
        let counter = document.getElementById("net_counter");
        let price_counter = document.getElementById("net_price");
        counter.value = net_count;
        price_counter.value = net_price;
        update_width(counter);
        update_width(price_counter);
    }
    
    
    // LOAD HATCHERIES
    if (isNaN(hatchery_count) || hatchery_count === null || isNaN(hatchery_price) || hatchery_price === null) {
        // do nothing
    } else {
        let counter = document.getElementById("hatchery_counter");
        let price_counter = document.getElementById("hatchery_price");
        counter.value = hatchery_count;
        price_counter.value = hatchery_price;
        update_width(counter);
        update_width(price_counter);
    }
    
    
    
    // LOAD UPDGRADE STATES
    
    
    temp = parseInt(localStorage.getItem("hasGlowworms"));
    if (!isNaN(temp)) {
        if(temp == 1) {
            hasGlowworms = 1;
        }
    }
    
    
    temp = parseInt(localStorage.getItem("hasAnglerfish"));
    if (!isNaN(temp)) {
        if(temp == 1) {
            hasAnglerfish = 1;
        }
    }
    
    // upgrade values are 0 by default, so there's no need to check for 0 and set them to 0.
}






function update() {
    var counter = document.getElementById("firefly_counter");
    counter.value = format_value(firefly_count);
    document.title = "Emberfly, Inc. : " + Math.floor(firefly_count) + " fireflies";
    update_width(counter);


    counter = document.getElementById("jar_counter");
    counter.value = format_value(jar_count);
    update_width(counter);

    counter = document.getElementById("jar_price");
    counter.value = format_value(jar_price);
    update_width(counter);
    
    
    counter = document.getElementById("net_counter");
    counter.value = format_value(net_count);
    update_width(counter);

    counter = document.getElementById("net_price");
    counter.value = format_value(net_price);
    update_width(counter);
    

    counter = document.getElementById("hatchery_counter");
    counter.value = format_value(hatchery_count);
    update_width(counter);

    counter = document.getElementById("hatchery_price");
    counter.value = format_value(hatchery_price);
    update_width(counter);
    
    
    update_brightness();
    
    update_buildings();
    
    update_upgrades();
    
    //update_story();

    save();
}



function update_upgrades() {

    
    if (hasGlowworms == 0) {
        let temp = document.getElementsByName("glowworms")[0];
        if (firefly_count >= BASE_GLOWWORMS_PRICE) {
            temp.disabled = false;
            temp.style.display = "inline-block";
            temp.style.opacity = 1;
        }
        else {
            temp.style.opacity = 0.5;
            temp.disabled = true;
        }
        
        
        // if don't have glowworms yet, 
        // disable all other upgrades
        // I want players to buy them in order.
        // worms > fish > whatever's next
        
        temp = document.getElementsByName("anglerfish")[0];
        temp.style.opacity = 0.5;
        temp.disabled = true;
    }
    
    else {
        let temp = document.getElementsByName("glowworms")[0];
        temp.disabled = true;
        temp.style.display = "none";
        temp.style.opacity = 0;
        hasGlowworms = 1;
    }
    
    
    if (hasAnglerfish == 0) {
        // Disable upgrade buttons if can't afford

        let temp = document.getElementsByName("anglerfish")[0];
        if (firefly_count >= BASE_ANGLERFISH_PRICE) {
            // display only if previous upgrade(s) 
            // has/have been bought already
            if(hasGlowworms == 1) {
                temp.disabled = false;
                temp.style.display = "inline-block";
                temp.style.opacity = 1;
            }
        }
        else {
            temp.style.opacity = 0.5;
            temp.disabled = true;
        }
    }
    else {
        let temp = document.getElementsByName("anglerfish")[0];
        temp.disabled = true;
        temp.style.display = "none";
        temp.style.opacity = 0;
    }
    
}



function update_buildings() {
    let temp = document.getElementsByName("Jar")[0];
    firefly_count < jar_price ? temp.disabled = true : temp.disabled = false;
    
    temp = document.getElementsByName("Net")[0];
    firefly_count < net_price ? temp.disabled = true : temp.disabled = false;
    
    temp = document.getElementsByName("Hatchery")[0];
    firefly_count < hatchery_price ? temp.disabled = true : temp.disabled = false;
}





function add() {
    firefly_count += 1;
    update();
    save();
}



function buy(category) {
    if (category == JAR) {
        if (firefly_count >= jar_price) {

            firefly_count -= jar_price;
            jar_count += 1;
            jar_price = Math.round(Math.pow(jar_price, 1.01));
            update();
        } else {
            // can't purchase. do nothing.
        }
     }
    
    
    
    else if (category == NET) {
        if (firefly_count >= net_price) {

            firefly_count -= net_price;
            net_count += 1;
            net_price = Math.round(Math.pow(net_price, 1.01));
            update();
        } else {
            // can't purchase. do nothing.
        }
    }
    
    
    
    
    else if (category == HATCHERY) {
        if (firefly_count >= hatchery_price) {

            firefly_count -= hatchery_price;
            hatchery_count += 1;
            hatchery_price = Math.round(Math.pow(hatchery_price, 1.01));
            update();
        } else {
            // can't purchase. do nothing.
        }
    }
    
    
    
    else if (category == GLOWWORMS){
        
        if (firefly_count >= BASE_GLOWWORMS_PRICE) {

            let temp = document.getElementsByName("glowworms")[0];
            
            temp.disabled = true;
            temp.style.display = "none";
            temp.style.opacity = 0;
            
            firefly_count -= BASE_GLOWWORMS_PRICE;
            hasGlowworms = 1;
            max_flies = 10000000; // 10 million
            
            temp = document.getElementById("fireflies_text");
            temp.innerHTML = "Glow Worms";
            
            temp = document.getElementById("tooltip");
            temp.innerHTML = "Glowing worms writhe in the earth";
            
            set_click_image("glowworm");
        }
        
    }
    
    
    else if (category == ANGLERFISH){
        
        if (firefly_count >= BASE_ANGLERFISH_PRICE) {

            let temp = document.getElementsByName("anglerfish")[0];
            
            temp.disabled = true;
            temp.style.display = "none";
            temp.style.opacity = 0;
            
            firefly_count -= BASE_ANGLERFISH_PRICE;
            hasAnglerfish = 1;
            max_flies = 100000000; // 10M
            
            temp = document.getElementById("fireflies_text");
            temp.innerHTML = "Angler Fish";
            
            temp = document.getElementById("tooltip");
            temp.innerHTML = "The seas teem with glowing fish";
                              
            set_click_image("anglerfish");
        }
        
    }
    
}




function update_width(thing) {
    thing.style.width = thing.value.length + 1 + "ch";
}



function calculate_brightness() {
    let percent =  1 * firefly_count / max_flies;

    if (percent < 0.3) {
        percent = percent * 2;
        if(percent > 0.3) {
            percent = 0.3;
            return percent;
        }
    }
    
    else if (percent < 0.5) {
        percent = percent * 1.5;
        if(percent > 0.5) {
            percent = 0.5;
            return percent;
        }
    }
    
    else if (percent > 1) {
        percent = 1;
        return percent;
    }
    
    return percent;
}



function update_brightness() {

    // max_flies = # of flies required to reach 100% brightness
    var percent = calculate_brightness();
    
    
    var wrapper = document.getElementById("wrapper");
    var main = document.getElementById("main");
    var temp = document.getElementById("background_gradient");
    
    
    if (hasAnglerfish == 1) {
        
        // rgba(255, 200, 255, 0.5), rgba(255, 0, 0, 0.5)
        
        temp.style.backgroundImage = "-moz-radial-gradient(rgba(255, 100, 255, 1), rgba(255, 0, 0, 0.5))";
        temp.style.backgroundImage = "-webkit-radial-gradient(rgba(255, 100, 255, 1), rgba(255, 0, 0, 0.5))";
        temp.style.backgroundImage = "-ms-radial-gradient(rgba(255, 100, 255, 1), rgba(255, 0, 0, 0.5))";
        temp.style.backgroundImage = "radial-gradient(rgba(255, 100, 255, 1), rgba(255, 0, 0, 0.5))";
        temp.style.opacity = percent/2;
        
        
        main.style.background = "rgba(0,0,255," + percent/5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(0, 200, 255," + percent / 3 + ")"; // 250, 200, 0
        
    }
    
    
    else if (hasGlowworms == 1) {
        temp.style.backgroundImage = "-moz-radial-gradient(rgba(100, 200, 0, " + percent/1.3 + "), rgba(0, 0, 255, 0.05))";
        temp.style.backgroundImage = "-webkit-radial-gradient(rgba(100, 200, 0, " + percent/1.3 + "), rgba(0, 0, 255, 0.05))";
        temp.style.backgroundImage = "-ms-radial-gradient(rgba(100, 200, 0, " + percent/1.3 + "), rgba(0, 0, 255, 0.05))";
        temp.style.backgroundImage = "radial-gradient(rgba(100, 200, 0, " + percent/1.3 + "), rgba(0, 0, 255, 0.05))";
        temp.style.opacity = percent;
        
        
        
        main.style.background = "rgba(0,150,0," + percent / 5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(220, 255, 0," + percent / 3 + ")";
    }
    
    
    if (hasGlowworms == 0) {
        temp.style.backgroundImage = "-moz-radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
        temp.style.backgroundImage = "-webkit-radial-gradient(rgba(200, 100, 0, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
        temp.style.backgroundImage = "-ms-radial-gradient(rgba(200, 130, 20, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
        temp.style.backgroundImage = "radial-gradient(rgba(200, 100, 0, " + percent.toString() + "), rgba(0, 0, 0, 0.1))";
        temp.style.opacity = percent;
        
        
        main.style.background = "rgba(150,102,10," + percent / 5 + ")";
        main.style.boxShadow = "0px -10px 50px 50px inset rgba(250, 200, 50," + percent / 3 + ")"; // 250, 200, 0
        
    }
    
    
    
    
    update_font_colors(percent);
}





function update_font_colors(percent) {

    
    function max255(num) {
        if (num > 255) {
            return 255;
        } else {
            return Math.floor(num);
        }
    }

    function min0(num) {
        if (num < 0) {
            return 0;
        } else {
            return Math.floor(num);
        }
    }

    
    
    // Update the special fireflies/angler/glowworm font gradient:
    
    function change_firefly_font(rgb1, rgb2) {
        let font = document.getElementsByClassName("fireflies");
        for (let i = 0; i < font.length; i++) {
            font[i].style.background = "-webkit-linear-gradient(top, rgb(" + max255(rgb1[0]) + "," + max255(rgb1[1]) + "," + max255(rgb1[2]) + "), rgb(" + max255(rgb2[0]) + "," + max255(rgb2[1]) + "," + max255(rgb2[2]) + "))";
            font[i].style.background = "-moz-linear-gradient(top, rgb(" + max255(rgb1[0]) + "," + max255(rgb1[1]) + "," + max255(rgb1[2]) + "), rgb(" + max255(rgb2[0]) + "," + max255(rgb2[1]) + "," + max255(rgb2[2]) + "))";
            font[i].style.background = "-ms-linear-gradient(top, rgb(" + max255(rgb1[0]) + "," + max255(rgb1[1]) + "," + max255(rgb1[2]) + "), rgb(" + max255(rgb2[0]) + "," + max255(rgb2[1]) + "," + max255(rgb2[2]) + "))";
            font[i].style.background = "linear-gradient(top, rgb(" + max255(rgb1[0]) + "," + max255(rgb1[1]) + "," + max255(rgb1[2]) + "), rgb(" + max255(rgb2[0]) + "," + max255(rgb2[1]) + "," + max255(rgb2[2]) + "))";

            font[i].style.webkitBackgroundClip = "text";
            font[i].style.MozbackgroundClip = "text";
            font[i].style.backgroundClip = "text";
        }
    }
    
    
    
    if (hasAnglerfish == 1) {
        
        let rgb1 = [255 * percent + 50, 255 * percent + 50, 255 * percent + 255];
        let rgb2 = [255 * percent + 100, 255 * percent + 0, 255 * percent + 100];
        
        change_firefly_font(rgb1, rgb2);
    }
    
    
    else if (hasGlowworms == 1) {
        
        let rgb1 = [255 * percent + 200, 255 * percent + 255, 255 * percent + 20];
        let rgb2 = [255 * percent + 70, 255 * percent + 105, 255 * percent + 0];
        change_firefly_font(rgb1, rgb2);
        
    }
    
    
    else {
        
        let rgb1 = [255 * percent + 235, 255 * percent + 173, 255 * percent + 0];
        let rgb2 = [255 * percent + 183, 255 * percent + 24, 255 * percent + 0];
        change_firefly_font(rgb1, rgb2);
    }
    
    
    
    
    // Update all the other fonts now:
    
    
    
    
    if (hasAnglerfish == 1) {
        font = document.getElementsByClassName("building");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 160) + "," + max255(255 * percent + 0) + ")";
        }

        font = document.getElementsByClassName("counter");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        }

        font = document.getElementsByClassName("price");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        }

        font = document.getElementsByClassName("title");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 224) + "," + max255(255 * percent + 238) + "," + max255(255 * percent + 199) + ")";
        }
    }
    
    
    else if (hasGlowworms == 1) {
        font = document.getElementsByClassName("building");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 80) + "," + max255(255 * percent + 185) + "," + max255(255 * percent + 30) + ")";
        }

        font = document.getElementsByClassName("counter");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 175) + "," + max255(255 * percent + 255) + "," + max255(255 * percent + 0) + ")";
        }

        font = document.getElementsByClassName("price");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 175) + "," + max255(255 * percent + 255) + "," + max255(255 * percent + 0) + ")";
        }

        font = document.getElementsByClassName("title");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 225) + "," + max255(255 * percent + 255) + "," + max255(255 * percent + 200) + ")";
        }
    }
    
    else {

        font = document.getElementsByClassName("building");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 160) + "," + max255(255 * percent + 0) + ")";
        }

        font = document.getElementsByClassName("counter");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        }

        font = document.getElementsByClassName("price");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 255) + "," + max255(255 * percent + 232) + "," + max255(255 * percent + 56) + ")";
        }

        font = document.getElementsByClassName("title");
        for (let i = 0; i < font.length; i++) {
            font[i].style.color = "rgb(" + max255(255 * percent + 224) + "," + max255(255 * percent + 238) + "," + max255(255 * percent + 199) + ")";
        }
    }
    
    
    
    
}





function reset() {
    var answer = confirm("Are you sure you want to reset? Your progress will be deleted.")
    if (answer == true) {
        firefly_count = BASE_FIREFLY_COUNT;
        
        jar_count = BASE_JAR_COUNT;
        jar_price = BASE_JAR_PRICE;
        
        net_count = BASE_NET_COUNT;
        net_price = BASE_NET_PRICE;
        
        hatchery_count = BASE_HATCHERY_COUNT;
        hatchery_price = BASE_HATCHERY_PRICE;

        reset_upgrades();

        update();
    }
}

function reset_upgrades() {
    //document.getElementsByClassName("upgrade").disabled = false;

    
    let temp = document.getElementsByName("glowworms")[0];
    if (firefly_count < BASE_GLOWWORMS_PRICE) {
        temp.disabled = true;
        temp.style.display = "none";
        temp.style.opacity = 0;
    }
    
    temp = document.getElementsByName("anglerfish")[0];
    if (firefly_count < BASE_ANGLERFISH_PRICE) {
        temp.disabled = true;
        temp.style.display = "none";
        temp.style.opacity = 0;
    }

    
    
    hasAnglerfish = 0;
    hasGlowworms = 0;
    
    // change clickable image back to default
    set_click_image("emberfly");
    
    
    temp = document.getElementById("fireflies_text");
    temp.innerHTML = "Fireflies";
            
    temp = document.getElementById("tooltip");
    temp.innerHTML = "Fireflies flutter in our midst";
    
}



function timer() {
    
    // Take fireflies per second (Fps) and divide by 4
    // so Jars give 1 Fps. So here put 0.25 * jar_count.
    
    firefly_count = firefly_count + calculate_reward(0.25);
    
    
    update();
}
setInterval(timer, 250);


function set_tooltip(tip) {
    var temp = document.getElementById("tooltip");
    
    //temp.innerHTML = "" + tip;
    
    if(tip == "JAR") {
        if(jar_count > 0)
            temp.innerHTML = "Jars catch " + format_value(calculate_building_reward("JAR")) + " per second";
        else 
            temp.innerHTML = "Jars catch " + format_value(BASE_JAR_REWARD) + " per second";
    }
    else if (tip == "NET") {
        if(net_count > 0)
            temp.innerHTML = "Nets catch " + format_value(calculate_building_reward("NET")) + " per second";
        else 
            temp.innerHTML = "Nets catch " + format_value(BASE_NET_REWARD) + " per second";
    }
    else if (tip == "HATCHERY") {
        if(hatchery_count > 0)
            temp.innerHTML = "Hatcheries incubate " + format_value(calculate_building_reward("HATCHERY")) + " per second";
        else 
            temp.innerHTML = "Hatcheries incubate " + format_value(BASE_HATCHERY_REWARD) + " per second";  
    }
    else if (tip == "JAR_FPS") {
        if(jar_count > 0)
            temp.innerHTML = "Jars are catching " + format_value(calculate_building_reward("JAR")*jar_count) + " per second";
        else 
            temp.innerHTML = "Jars are catching " + format_value(BASE_JAR_REWARD*jar_count) + " per second";
    }
    else if (tip == "NET_FPS") {
        if(net_count > 0)
            temp.innerHTML = "Nets are catching " + format_value(calculate_building_reward("NET")*net_count) + " per second";
        else 
            temp.innerHTML = "Nets are catching " + format_value(BASE_NET_REWARD*net_count) + " per second";
    }
    else if (tip == "HATCHERY_FPS") {
        if(hatchery_count > 0)
            temp.innerHTML = "Hatcheries are incubating " + format_value(calculate_building_reward("HATCHERY")*hatchery_count) + "/sec";
        else 
            temp.innerHTML = "Hatcheries are incubating " + format_value(BASE_HATCHERY_REWARD*hatchery_count) + "/sec";
    }
    
    else if (tip == "GLOWWORMS") {
        temp.innerHTML = "Worms.. that glow";
        
    }
    
    else if (tip == "ANGLERFISH") {
        temp.innerHTML = "Perhaps these could be useful?";
        
    }
    
    else if (tip == "TOTAL_FPS") {
        temp.innerHTML = "Buildings give " + format_value(calculate_reward(1)) + " per second";
        
    }
    
    else if (tip=="BLANK") {
        temp.innerHTML = "&nbsp;";
    }
    
    else if (tip == "BUILDING") {
        temp.innerHTML = "You have " + (jar_count + net_count + hatchery_count) + " buildings";
        
    }
    
    else if (tip == "COUNT") {
        temp.innerHTML = "Total production is  " + format_value(calculate_reward(1)) + " per second";
        
    }
    
    else if (tip == "PRICE") {
        temp.innerHTML = " ";
        
    }
    
    else if (tip == "CLICKING") {
        temp.innerHTML = "You catch 1 at a time";
        
    }
    
}



function set_click_image(img) {
    
    let images = ["emberfly", "glowworm", "anglerfish"];
    
    
    for(elem of images) {
        if (img == elem) {
            let temp = document.getElementById(elem);
            temp.style.display = "inline-block";
        }
        else {
            let temp = document.getElementById(elem);
            temp.style.display = "none";
        }
    }
}



if ('addEventListener' in window) {
    window.addEventListener('load', load());
}
