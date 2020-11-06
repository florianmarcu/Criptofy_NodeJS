var lastFilter;

function sortTableByColumn(table, column, asc = true){
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    
    const sortedRows = rows.sort((a,b)=> {
        
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        console.log(parseFloat(aColText));
        return parseFloat(aColText) > parseFloat(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
    })

    // Remove all existing TRs from the table

    while(tBody.firstChild){
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted arrays 
    tBody.append(...sortedRows);
    

    ///Remember how the column is currently sorted

    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}


document.querySelectorAll("#crypto-table th").forEach(headerCell=>{
    headerCell.addEventListener("click", ()=>{
        
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        if(headerIndex >= 1){
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
            changeLastFilter(`${headerIndex} ${currentIsAscending}`);
        }
    })
})

function changeLastFilter(value){
    localStorage.setItem("lastFilter", value);
    //console.log(localStorage.getItem("lastFilter").headerIndex);
}

window.onload = function(){

    console.log(lastFilter);
    ///local storage pentru filtru
    var storage = localStorage.getItem("lastFilter").split(' ');
    if (lastFilter=storage){
            const tableElement = document.getElementById('crypto-table');
            console.log(tableElement);
            sortTableByColumn(tableElement, parseInt(lastFilter[0]), this.lastFilter[1]);
    }
	else
		lastFilter = {};

    //// selectare de element si schimbare stil CSS
    var percentChange24H = document.querySelectorAll('#crypto-table td:nth-child(4)');
    percentChange24H.forEach(element => {
        if(parseFloat(element.textContent) >= 0 )
            element.style.color = 'rgb(58,181,0)';
        else 
            element.style.color = 'red';
        
    });
    var percentChange7D = document.querySelectorAll('#crypto-table td:nth-child(5)');
    percentChange7D.forEach(element => {
        if(parseFloat(element.textContent) >= 0 )
            element.style.color = 'rgb(58,181,0)';
        else 
            element.style.color = 'red';
        
    });

    ///
    /// filtrare si creare de element
    let filtreButton = document.getElementById('filtre-button')
    let counter = false;

    function filtre(){
        const table = document.getElementById('crypto-table');
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
        for (let row of rows){
            let value = row.querySelector("td:nth-child(2)").textContent.trim();
            sum+= parseFloat(value);
        }
    }

    function getSum(){

        const table = document.getElementById('crypto-table');
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
        var sum = 0;
        for (let row of rows){
            let value = row.querySelector("td:nth-child(2)").textContent.trim();
            sum+= parseFloat(value);
        }
        return sum;
    }




    function selectButton(button){
        button.style.backgroundColor = 'rgb(70, 116, 117)';
        button.style.border = '10px solid rgb(70, 116, 117)';
        button.style.borderRadius = '10px';
    }
    function deselectButton(button){
        button.style.backgroundColor = 'cadetblue';
        button.style.border = '10px solid cadetblue';
        button.style.borderRadius = '5px';
    }
    filtreButton.onclick = async function(){
        if(!counter){
            var div = document.getElementById('filtre-button-div');
            // var decreasingButton = document.createElement("BUTTON");
            ///     --------------------------------CALCULARE---------------------------------
            var sumText = document.createElement("BUTTON");
            sumText.innerText = getSum();
            sumText.id = 'sum-text';
            sumText.style.backgroundColor = 'cadetblue';
            sumText.style.border = '10px solid cadetblue';
            sumText.style.borderRadius = '5px'; 
            sumText.style.fontSize = '20px';
            div.appendChild(sumText);
            // decreasingButton.innerText = 'Decreasing';
            // decreasingButton.id = 'desc-button';
            // //div.appendChild(decreasingButton);
            // var increasingButton = document.createElement("BUTTON");
            // increasingButton.innerText = 'Increasing';
            // increasingButton.id = 'inc-button';
            // //div.appendChild(increasingButton);
            // //functiile onclick pentru butoanele de sortare
            // decreasingButton.onclick = async function(){
            //     //var cryptoData = app.locals.cryptoData; ///////////////////////
            //     var table = document.getElementById("crypto-table").innerHTML;
            //     //console.log(table);
            //     console.log(table);
            //     let regex = RegExp('</a>');
            //     table = table.split(regex);
                
            //     console.log(table[1].indexOf('</td',4));
            //     cryptoData.data.sort(function (a, b) {
            //         return a.quote.USD.price.localeCompare(b.quote.USD.price);
            //     });
            //     //window.cryptoData = '<%= %>'
            //     selectButton(decreasingButton);
            //     deselectButton(increasingButton);
            //     let newTable = "<thead><tr><th>Moneda</th><th>Valoare</th><th>Volum (24h)</th><th>Schimbare (24h)</th><th>Schimbare (7d)</th></tr></thead>";
            //     for(let i = 0; i < cryptoData.data.length; i++){
            //         newTable += '<tr>';
            //             //first column
            //             newTable +='<td>';
            //                 newTable += '<img src= "https://s2.coinmarketcap.com/static/img/coins/64x64/'+ cryptoData.data[i].id + '.png" alt="" width=16px height = 16px>'
            //             newTable += '</td>';
            //             //second column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.price;
            //             newTable += '</td>';
            //             //third column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.volume_24h;
            //             newTable += '</td>';
            //             //fourth column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.percent_change_24h;
            //             newTable += '</td>';
            //             //fifth column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.percentChange7D;
            //             newTable += '</td>';
            //         newTable += '</tr>';
            //     }
            //     document.getElementById("crypto-table").innerHTML  = newTable; 
            // }
            // increasingButton.onclick = async function(){
            //     //var cryptoData = app.locals.cryptoData;  /////////////////////////
            //     cryptoData.data.sort(function (a, b) {
            //         return b.quote.USD.price.localeCompare(a.quote.USD.price);
            //     });
            //     //window.cryptoData = '<%= %>'
            //     selectButton(increasingButton);
            //     deselectButton(decreasingButton);
            //     let newTable = "<thead><tr><th>Moneda</th><th>Valoare</th><th>Volum (24h)</th><th>Schimbare (24h)</th><th>Schimbare (7d)</th></tr></thead>";
            //     for(let i = 0; i < cryptoData.data.length; i++){
            //         newTable += '<tr>';
            //             //first column
            //             newTable +='<td>';
            //                 newTable += '<img src= "https://s2.coinmarketcap.com/static/img/coins/64x64/'+ cryptoData.data[i].id + '.png" alt="" width=16px height = 16px>'
            //             newTable += '</td>';
            //             //second column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.price;
            //             newTable += '</td>';
            //             //third column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.volume_24h;
            //             newTable += '</td>';
            //             //fourth column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.percent_change_24h;
            //             newTable += '</td>';
            //             //fifth column
            //             newTable +='<td>';
            //                 newTable += cryptoData.data[i].quote.USD.percentChange7D;
            //             newTable += '</td>';
            //         newTable += '</tr>';
            //     }
            //     document.getElementById("crypto-table").innerHTML  = newTable; 
            // }
            //se schimba stilul butonului
            var button = document.getElementById('filtre-button');
            button.style.backgroundColor = 'rgb(70, 116, 117)';
            button.style.border = '10px solid rgb(70, 116, 117)';
            button.style.borderRadius = '10px';
            counter = !counter;
        }
        else {
            var div = document.getElementById('filtre-button-div');
            // var increasingButton = document.getElementById('inc-button');
            var sumValue = document.getElementById('sum-text');
            // div.removeChild(increasingButton);
            div.removeChild(sumValue);
            //aduce butonul la normal
            var button = document.getElementById('filtre-button');
            button.style.backgroundColor = 'cadetblue';
            button.style.border = '10px solid cadetblue';
            button.style.borderRadius = '5px';
            counter = !counter;
        }
    }


  }

function setValue(){
    console.log(nr_chr);
    var info=document.getElementById("filter");
    info.innerHTML=nr_chr;
}
