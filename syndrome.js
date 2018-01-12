(function () {
	document.documentElement.removeAttribute('style');
	document.documentElement.removeAttribute('class');
	document.body.removeAttribute('class');
    document.body.innerHTML = '';
	document.body.style['color'] = '#414b56';
    document.title = "Payment Request API"
	
	var text = document.createElement('div');
	text.innerText = "Sunglasses — $95.00";
	text.style['position'] = 'absolute';
    text.style['top'] = '50%';
    text.style['left'] = '50%';
    text.style['transform'] = 'translate(-50%, -500%)';
	text.style['font-size'] = '30px';
	text.style['font-style'] = 'italic';
	document.body.appendChild(text);
	
	var image = document.createElement('div');
    image.style['position'] = 'absolute';
    image.style['top'] = '50%';
    image.style['left'] = '50%';
    image.style['transform'] = 'translate(-50%, -50%)';
	image.style['background-image'] = 'url("https://localhost/sunglasses.jpeg")';
	image.style['background-size'] = '224px 79px';
	image.style['width'] = '224px';
	image.style['height'] = '79px';
	document.body.appendChild(image);

    var button = document.createElement('button');
    button.style['position'] = 'absolute';
    button.style['display'] = 'block';
    button.style['top'] = '50%';
    button.style['left'] = '50%';
    button.style['transform'] = 'translate(-50%, 300%)';
	if (window.ApplePaySession) {
	    button.style['-webkit-appearance'] = '-apple-pay-button';
	    button.style['-apple-pay-button-style'] = 'black';
	    button.style['-apple-pay-button-type'] = 'buy';
	} else {
		button.innerText = "Purchase Using Chrome";
		button.style['background-color'] = 'navy';
		button.style['color'] = 'white';
	}
    document.body.appendChild(button);

    var merchantId = document.createElement('select');
    merchantId.id = 'merchantId';
    merchantId.style['visibility'] = 'hidden';
    
    var merchantOption = document.createElement('option');
    merchantOption.value = 'merchant.com.frameworksqa.syndromeweb.ecc-staging';
    merchantOption.selected = true;
    merchantId.appendChild(merchantOption);

    document.body.appendChild(merchantId);

    var startSessionEnvironment = document.createElement('select');
    startSessionEnvironment.id = 'startSessionEnvironment';
    startSessionEnvironment.style['visibility'] = 'hidden';

    var startSessionOption = document.createElement('option');
    startSessionOption.value = 'Auto';
    startSessionOption.selected = true;
    startSessionEnvironment.appendChild(startSessionOption);

    document.body.appendChild(startSessionEnvironment);
    
    function createRequest()
    {
        let networks = ['amex', 'diners', 'discover', 'jcb', 'mastercard', 'unionpay',
      'visa', 'mir'];
  let types = ['debit', 'credit', 'prepaid'];
  let supportedInstruments = [{
    supportedMethods: networks,
  }, {
    supportedMethods: ['basic-card'],
    data: {supportedNetworks: networks, supportedTypes: types},
  }];

  let details = {
    total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'USD', value: '65.00'},
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'USD', value: '-10.00'},
      },
    ],
  };

  return new PaymentRequest(supportedInstruments, details);
    }

    button.onclick = () => createRequest().show().then(response => response.complete("success"));
})();
