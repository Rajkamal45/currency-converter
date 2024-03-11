// Function to display loading indicator
function showLoading() {
  document.getElementById('result').innerText = 'Loading...';
}

// Function to hide loading indicator
function hideLoading() {
  document.getElementById('result').innerText = '';
}

// Function to fetch data from an API with error handling
async function fetchData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

// Function to populate currencies dropdown
async function populateCurrencies() {
  const currenciesData = await fetchData('https://api.exchangerate-api.com/v4/latest/USD');
  if (!currenciesData) return;

  const currencies = Object.keys(currenciesData.rates);
  const fromCurrencyDropdown = document.getElementById('fromCurrency');
  const toCurrencyDropdown = document.getElementById('toCurrency');

  currencies.forEach(currency => {
      const option1 = createOption(currency);
      const option2 = createOption(currency);
      fromCurrencyDropdown.appendChild(option1);
      toCurrencyDropdown.appendChild(option2);
  });

  // Set default currencies
  fromCurrencyDropdown.value = 'USD';
  toCurrencyDropdown.value = 'EUR';

  // Trigger conversion initially
  convertCurrency();
}

// Function to create an option element
function createOption(value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  return option;
}

// Function to update flag icons
// Function to update flag icons
// Function to update flag icons
async function updateFlagIcons() {
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;

  const flagUrls = await Promise.all([
      fetch(`https://countryflags.io/${fromCurrency.slice(0, 2)}/flat/64.png`).then(response => response.ok ? response.url : null),
      fetch(`https://countryflags.io/${toCurrency.slice(0, 2)}/flat/64.png`).then(response => response.ok ? response.url : null)
  ]);

  document.getElementById('fromFlag').src = flagUrls[0] || 'placeholder.png';
  document.getElementById('toFlag').src = flagUrls[1] || 'placeholder.png';
}



// Function to convert currency
async function convertCurrency() {
  const amount = document.getElementById('amount').value;
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;

  showLoading(); // Show loading indicator

  const exchangeRates = await fetchData(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  if (!exchangeRates) {
      hideLoading(); // Hide loading indicator
      document.getElementById('result').innerText = 'Error fetching exchange rates. Please try again later.';
      return;
  }

  const rate = exchangeRates.rates[toCurrency];
  if (rate !== undefined) {
      const convertedAmount = (amount * rate).toFixed(2);
      hideLoading(); // Hide loading indicator
      document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } else {
      hideLoading(); // Hide loading indicator
      document.getElementById('result').innerText = 'Error: Conversion rate not available for selected currencies.';
  }
}

// Initial function calls
populateCurrencies();
updateFlagIcons();
