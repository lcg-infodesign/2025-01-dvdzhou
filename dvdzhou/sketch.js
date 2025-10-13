let table;
let results = [];
let roundedResults = [];
let displayedResults = [];
let resultsP = [];

let grid, checkbox;
let operations, keywords;

//const xMax = visualViewport.width;
//const yMax = visualViewport.height;

function preload() {
    table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
    let cols, value;

    //createCanvas(xMax, yMax);
    noCanvas();

    console.log(table.getRowCount() + " total rows in table");

    // Keep valid rows based on rules inside 'rules.txt': column2 < 0, column2 > 60
    for (let r = 0; r < table.getRowCount(); r++) {
        value = table.getString(r, 2);
        if (value >= 0 && value <= 60) {
            table.removeRow(r);
            r--;
            //console.log(value);
        }
    }

    console.log(table.getRowCount() + " total rows in table");

    cols = [
        table.getColumn(0),
        table.getColumn(1),
        table.getColumn(2),
        table.getColumn(3),
        table.getColumn(4)
    ];
    console.log(cols);

    // Mean of the 1t column
    results.push(getMean(cols[0]));
    //console.log("Results: " + results);

    // Standard deviation of the 2nd column
    results.push(getStandardDeviation(cols[1]));
    //console.log("Results: " + results);

    // Mode of the 3rd column
    results.push(getMode(cols[2]));
    //console.log("Results: " + results);

    // Median of the 4th column
    results.push(getMedian(cols[3]));
    //console.log("Results: " + results);

    // Mean and standard deviation of the 5th column
    results.push([getMean(cols[4]), getStandardDeviation(cols[4])]);
    
    // ** Round results to 2 decimal places**

    results.forEach((e, i) => {
        if (Array.isArray(e))
            roundedResults[i] = e.map(v => round(v, 2));
        else
            roundedResults[i] = round(e, 2);
    });
    console.log(results);
    console.log(roundedResults);

    //checkbox = createCheckbox("Show rounded results", true);
    //checkbox.position(0, 150);
    checkbox = select("#round-results");
    checkbox.checked(true);

    // ** Grid generation **

    /*operations = [
        ["Mean/of the 1st column"],
        ["Standard deviation/of the 2nd column"],
        ["Mode/of the 3rd column"],
        ["Median/of the 4th column"],
        ["Mean/and/standard deviation/of the 5th column"]
    ];
    operations = [
        ["1st column's/mean"],
        ["2nd column's/standard deviation"],
        ["3rd column's/mode"],
        ["4th column's/median"],
        ["5th column's/mean/and/standard deviation"]
    ];*/
    operations = [
        ["Mean/(Col 0)"],
        ["Standard deviation/(Col 1)"],
        ["Mode/(Col 2)"],
        ["Median/(Col 3)"],
        ["Mean/and/standard deviation/(Col 4)"]
    ];

    keywords = ["mean", "standard deviation", "mode", "median"];

    grid = select("#grid");
    for (let i = 0; i < operations.length; i++) {
        grid.child(createGridBox("operation" + i, operations[i][0]));
        //grid.child(createGridBox("operation" + i, operations[i][0], operations[i][1]));
    }

    // ** Canvas generation **

    new p5(canvas1);
    new p5(canvas2);
    new p5(canvas3);
    new p5(canvas4);
    new p5(canvas5);
}

function draw() {
    //background(255); // Allows to clean canvas on each frame

    if (checkbox.checked())
        displayedResults = roundedResults;
    else
        displayedResults = results;

    /*// Test display of results
    textSize(16);
    fill(0);
    textAlign(LEFT, TOP);
    text("Mean of 1st column: " + displayedResults[0], 10, 10);
    text("Standard deviation of 2nd column: " + displayedResults[1], 10, 30);
    text("Mode of 3rd column: " + displayedResults[2], 10, 50);
    text("Median of 4th column: " + displayedResults[3], 10, 70);
    text("Mean of 5th column: " + displayedResults[4][0], 10, 90);
    text("Standard deviation of 5th column: " + displayedResults[4][1], 10, 110);*/
    
    updateResultsP();
}

function getMean(arr) {
    //let sum = 0;
    //arr.forEach(e => sum += Number(e))
    //return sum / arr.length;
    return arr.reduce((sum, e) => sum + Number(e), 0) / arr.length;
}

function getStandardDeviation(arr) {
    return Math.sqrt(getMean(arr.map(x => Math.pow(x - getMean(arr), 2))));
}

function getFrequencyMap(arr) {
    let frequencyMap = {};

    // Count the frequency of each element
    arr.forEach(n => frequencyMap[n] = (frequencyMap[n] || 0) + 1);

    return frequencyMap;
}

function getMode(arr) {
    let frequencyMap = getFrequencyMap(arr);
    let maxFrequency = 0;
    let modes = [];

    // Find the element with the highest frequency
    for (let n in frequencyMap) {
        // New highest frequency found
        if (frequencyMap[n] > maxFrequency) {
            modes = [Number(n)];
            maxFrequency = frequencyMap[n];
        }
        // Another element with the same highest frequency found
        else if (frequencyMap[n] === maxFrequency) {
            modes.push(Number(n));
        }
    }

    // No mode if all numbers appear with the same frequency
    if (modes.length === Object.keys(frequencyMap).length) modes = [];

    return modes;
}

function getMedian(arr) {
    let sorted = arr.toSorted((a, b) => a - b);
    let middle = Math.floor(sorted.length / 2);

    // If even, return the average of the two middle numbers; if odd, return the middle number
    if (sorted.length % 2 === 0)
        return (Number(sorted[middle - 1]) + Number(sorted[middle])) / 2;
    else
        return Number(sorted[middle]);
}

//function createGridBox(id, s1, s2) {
function createGridBox(id, operation) {
    // Create box
    let box = createDiv();
    box.id(id);
    box.class("group w-full nth-3:xl:col-span-2 hover:text-neutral-700 outline outline-neutral-400 hover:outline-neutral-700 ease-out duration-400 px-8 pt-5 pb-8 rounded-xl");
    //box.class("basis-full md:basis-[calc(50%-1rem)] group hover:text-neutral-700 outline outline-neutral-400 hover:outline-neutral-700 ease-out duration-400 px-8 pt-5 pb-8 rounded-xl");
    //box.class("w-full group hover:text-neutral-700 outline outline-neutral-400 hover:outline-neutral-700 ease-out duration-400 px-8 pt-5 pb-8 rounded-xl");

    let header = createDiv();
    header.class("flex justify-between");
    header.parent(box);
    
    // Create box title
    let title = createElement("h3");
    title.class("mb-4 text-xl text-neutral-500 group-hover:text-neutral-700 duration-400 ease-out");

    // Search given string (eg. "Mean/and/standard deviation/of the 5th column") and highlight keywords
    let output = [];
    operation.split("/").forEach(o => {
        if (keywords.some(k => k.toLowerCase() === o.toLowerCase()))
            output.push(`<span class="group-hover:underline">${o}</span>`);
        else
            output.push(o);
    });

    title.html(output.join(" "));
    //title.html(`<span class="group-hover:underline">${s1}</span> ${s2}`)
    title.parent(header);

    let result = createP();
    result.class("text-xl hidden group-hover:block group-hover:text-neutral-700 font-bold duration-400 ease-out");
    result.parent(header);
    resultsP.push(result);

    return box;
}

function updateResultsP() {
    resultsP.forEach((r, i) => {
        //r.html((displayedResults[i] instanceof Array) ? displayedResults[i].join(", "): displayedResults[i]);
        r.html([].concat(displayedResults[i]).join(", "));
    });
}

// "Mean of the 1st column"
function canvas1(p) {
    let c, box, canvasWidth, canvasHeight;
    const baseline = 100;

    p.setup = () => {
        // The canvas adapts to the box's width
        box = select("#operation0");
        canvasWidth = box.size().width - 64; // 64 is the sum of the left and right padding
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);
    }

    p.draw = () => {
        p.background(255);
        p.translate(canvasWidth/2, canvasHeight/2);

        p.stroke(0);
        p.strokeWeight(0.1);
        p.circle(0, 0, 0);

        const maxAbsValue = p.max(table.getColumn(2).map(v => p.abs(v)));

        const minDiameter = 0;
        const maxDiameter = p.min(canvasWidth, canvasHeight) * 0.9;

        table.getColumn(2).forEach(val => {
            // Circle size is based on absolute value
            let diameter = p.map(p.abs(val), 0, maxAbsValue, minDiameter, maxDiameter);
            
            if (val >= 0) {
                p.stroke("#fff085");
            } else {
                p.stroke("#894b00");
            }
            
            p.strokeWeight(1.5);
            p.circle(0, 0, diameter);
        });
            
        // Mean's cirlce
        p.stroke(0);
        p.strokeWeight(4);
        p.circle(0, 0, results[0]);
    }

    p.windowResized = () => {
        canvasWidth = box.size().width - 64;
        p.resizeCanvas(canvasWidth, canvasHeight);
    }
}

// "Standard deviation of the 2nd column"
function canvas2(p) {
    let c, box, canvasWidth, canvasHeight;
    let text, textSize;
    let x, y;
    let xSpeed, ySpeed;

    p.setup = () => {
        box = p.select("#operation1");
        canvasWidth = box.size().width - 64;
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);

        x = canvasWidth / 2;
        y = canvasHeight / 2;

        xSpeed = random(-4, 4);
        ySpeed = random(-3, 3);

        textSize = 50;

        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(textSize);
        p.fill("#fff085");
        p.stroke(0);
        p.strokeWeight(2);
    }

    p.draw = () => {
        p.background(255);
        drawText();
    }

    p.windowResized = () => {
        canvasWidth = box.size().width - 64;
        p.resizeCanvas(canvasWidth, canvasHeight);
    }

    function drawText() {
        text = displayedResults[1];

        // Move the text
        x += xSpeed;
        y += ySpeed;

        // Check for collisions with the canvas edges and reverse direction
        let textW = p.textWidth(text); // To get the rough bounding box of the text
        
        // Check horizontal bounce
        if (x > canvasWidth - textW / 2 || x < textW / 2) {
            xSpeed *= -1;
        }

        // Check vertical bounce
        // We divide messageSize by 2 as a simple way to approximate the top/bottom boundary
        if (y > canvasHeight - textSize / 2 || y < textSize / 2) {
            ySpeed *= -1;
        }

        // Draw the text at its current position
        p.text(text, x, y);
    }
}

// "Mode of the 3rd column"
function canvas3(p) {
    let c, box, canvasWidth, canvasHeight, bars;

    p.setup = () => {
        box = p.select("#operation2");
        canvasWidth = box.size().width - 64;
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);

        setBars();

        // Force reload of canvas; setTimeout allows this instruction to be executed last
        setTimeout(p.windowResized, 0);
    }

    p.draw = () => {
        p.background(255);
        drawBars();

        for (let bar of bars) {
            // Check if cursor is within bar's area
            if ((p.mouseX >= bar.x) && (p.mouseX < bar.x + bar.w) && (p.mouseY >= bar.y) && (p.mouseY < bar.y + bar.h)) {
                // Draw label
                p.fill(0);
                p.text(`Valore: ${bar.key}`, 10, 20);
                p.text(`Frequenza: ${bar.value}`, 10, 35);
                
                break;
            }
        }
    }

    p.windowResized = () => {
        canvasWidth = box.size().width - 64;
        p.resizeCanvas(canvasWidth, canvasHeight);

        // Regenerate bars
        setBars();
    }

    function setBars() {
        let startColor = p.color("#ffffff");
        let endColor = p.color("#fff085");

        let col = getFrequencyMap(table.getColumn(2));
        let colKeys = Object.keys(col);
        let colValues = Object.values(col);
        //console.log(col);
        //console.log(Object.keys(col).length);

        /*let orderedByKey = colKeys
            .toSorted((a, b) => Number(a) - Number(b)).map(key => {
                return { 
                    key: key, 
                    value: col[key] 
                };
            });*/

        let orderedByValue = colKeys
            .toSorted((a, b) => col[a] - col[b])
            .map(key => {
                return { 
                    key: key, 
                    value: col[key] 
                };
            });

        //console.log(orderedByKey);
        //console.log(orderedByValue);

        let spacing = canvasWidth/colValues.length;
        let x = 0;

        const minVal = p.min(colValues);
        const maxVal = p.max(colValues);
        
        // loop through data
        bars = [];
        
        for (const item of orderedByValue) {
            // Set color
            let amt = p.map(item.value, minVal, maxVal, 0, 1);
            let currentColor = p.lerpColor(startColor, endColor, amt);

            bars.push({
                x: x,
                y: 0,
                w: spacing,
                h: canvasHeight,
                color: currentColor,
                key: item.key,
                value: item.value
            });

            x = x + spacing;
        }

        /*for (let [k, v] of Object.entries(col)) {
            // Set color
            let amt = p.map(v, minVal, maxVal, 0, 1);
            let currentColor = p.lerpColor(startColor, endColor, amt);

            bars.push({
                x: x,
                y: 0,
                w: spacing,
                h: canvasHeight,
                color: currentColor,
                key: k,
                value: v
            });

            x = x + spacing;
        }*/
    }

    function drawBars() {
        p.push();
        // Draw rect
        bars.forEach(bar => {
            //p.stroke(bar.color);
            p.stroke(0);
            p.strokeWeight(0.1);
            p.fill(bar.color);
            p.rect(bar.x, bar.y, bar.w, bar.h);
        });
        p.pop();
    }
}

// "Median of the 4th column"
function canvas4(p) {
    let c, box, canvasWidth, canvasHeight;

    p.setup = () => {
        box = p.select("#operation3");
        canvasWidth = box.size().width - 64;
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);
    }

    p.draw = () => {
        p.background(255);
        p.translate(canvasWidth/2, canvasHeight/2);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill("#fff085");
        p.textSize(100);
        p.textStyle(p.BOLD);
        p.stroke(0);
        p.strokeWeight(2);
        p.text(displayedResults[3], 0, 0);
    }

    p.windowResized = () => {
        canvasWidth = box.size().width - 64;
        p.resizeCanvas(canvasWidth, canvasHeight);
    }
}

// "Mean and standard deviation of the 5th column"
function canvas5(p) {
    let c, box, canvasWidth, canvasHeight;

    p.setup = () => {
        box = p.select("#operation4");
        canvasWidth = box.size().width - 64;
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);
    }

    p.draw = () => {
        p.background(255);
        p.translate(canvasWidth/2, canvasHeight/2);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill("#fff085");
        p.textSize(100);
        p.textStyle(p.BOLD);
        p.stroke(0);
        p.strokeWeight(2);
        p.text(displayedResults[4].join("\n"), 0, 0);
    }

    p.windowResized = () => {
        canvasWidth = box.size().width - 64;
        p.resizeCanvas(canvasWidth, canvasHeight);
    }
}

/*// "Standard deviation of the 5th column"
function canvas6(p) {
    let c, box, canvasWidth, canvasHeight;

    p.setup = () => {
        box = p.select("#operation5");
        canvasWidth = box.size().width - 64;
        canvasHeight = 400;
        
        c = p.createCanvas(canvasWidth, canvasHeight);
        c.parent(box);
    }

    p.draw = () => {
        p.background(0);
    }
}*/