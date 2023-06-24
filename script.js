const api = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

let data = [];

fetch(api)
  .then(response => response.json())
  .then(dataResponse => {
    data = dataResponse;
    renderTable(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

async function fetchData() {
  try {
    const response = await fetch(api);
    let data = await response.json();
    renderTable(data);
    setupEventListeners();
  } catch (error) {
    let apifail = document.getElementsByClassName('apifail')[0];
    apifail.innerHTML = ` Data loaded Fail: 
     <span id="a">Refresh The Page Or Try SomeTimes  Later</span>`;
    console.error('Error:', error);
  }
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('keypress', () => {
    const searchTerm = searchInput.value.toLowerCase();

    let filteredData = data.filter((element) => {
      const itemName = element.name.toLowerCase();
      const itemSymbol = element.symbol.toLowerCase();
      return itemName.includes(searchTerm) || itemSymbol.includes(searchTerm);
    });

    renderTable(filteredData);
    
  });

  document.getElementById('sortMarketCapButton').addEventListener('click', () => {
    data.sort((a, b) => b.market_cap - a.market_cap );
    renderTable(data);
  });

  document.getElementById('sortPercentageButton').addEventListener('click', () => {
    data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    renderTable(data);
  });

  searchInput.value = "";
}

function renderTable(data) {
  let tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = ''; // Clear the table body before rendering new data

  data.forEach((element) => {
    let row = document.createElement('tr');
    const percentageChange = element.price_change_percentage_24h;
    const percentageChangeClass = percentageChange >= 0 ? 'positive-change' : 'negative-change';
    row.innerHTML =
      `
      <td id="data1"><img src="${element.image}" alt="" width="20"></td>
      <td>${element.id}</td>
      <td>${element.symbol}</td>
      <td>$${element.current_price}</td>
      <td>$${element.total_volume}</td>
      <td class="${percentageChangeClass}">${element.price_change_percentage_24h}%</td>
      <td><span class="mkt">Mkt Cap: </span>${element.market_cap}</td>
      `;
    row.classList.add('table-row-border');
    tableBody.append(row);
  });
}

fetchData();
