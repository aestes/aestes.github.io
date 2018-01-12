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
	image.style['background-image'] = 'url("https://aestes.github.io/sunglasses.jpeg")';
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
        const applePayMethod = {
            supportedMethods: "https://apple.com/apple-pay",
            data: {
                version: 3,
                merchantIdentifier: "com.apple.merchant",
                merchantCapabilities: ["supports3DS"],
                supportedNetworks: ["visa", "masterCard"],
                countryCode: "US",
            },
        };
		
		const basicCardMethod = {
			supportedMethods: "basic-card",
		};
    
        var total = {
            label: "Total",
            amount: {
                currency: "USD",
                value: "100.00",
            },
        };
    
        const shippingOptions = [
            {
                id: "ground",
                label: "Ground Shipping",
                amount: {
                    currency: "USD",
                    value: "5.00",
                },
                selected: true,
            },
            {
                id: "express",
                label: "Express Shipping",
                amount: {
                    currency: "USD",
                    value: "10.00",
                },
            },
        ];
    
        const displayItems = [
            {
                label: "Sunglasses",
                amount: {
                    currency: "USD",
                    value: "95.00",
                }
            },
            {
                label: "Shipping",
                amount: {
                    currency: "USD",
                    value: "5.00",
                }
            },
        ];

        const details = {
            total,
            displayItems,
            shippingOptions,
        };

        const options = {
            requestPayerName: true,
            requestPayerEmail: true,
            requestPayerPhone: true,
            requestShipping: true,
        };

        var request = new PaymentRequest([basicCardMethod, applePayMethod], details, options);

        window.completeMerchantValidation = (event, merchantSession) => {
            event.complete(merchantSession);
        };

        request.onapplepayvalidatemerchant = (event) => {
            callStartSession(request, event);
        };

        request.onapplepaypaymentmethodchanged = (event) => {
            event.updateWith({ total, shippingOptions, displayItems });
        };

        request.onshippingaddresschange = (event) => {
            if (request.shippingAddress.postalCode === '95014')
                event.updateWith({ error: "Cannot ship to postal code 95014" });
            else
                event.updateWith({ total, shippingOptions, displayItems });
        };

        request.onshippingoptionchange = (event) => {
            var shippingValue;
            var totalValue;
            if (request.shippingOption === 'ground') {
                shippingValue = '5.00';
                totalValue = '100.00';
            } else {
                shippingValue = '10.00';
                totalValue = '105.00';
            }

            const displayItems = [
                {
                    label: "Sunglasses",
                    amount: {
                        currency: "USD",
                        value: "95.00",
                    }
                },
                {
                    label: "Shipping",
                    amount: {
                        currency: "USD",
                        value: shippingValue,
                    }
                },
            ];

            event.updateWith({
                total: {
                    label: "Total",
                    amount: {
                        currency: "USD",
                        value: totalValue,
                    },
                },
                shippingOptions,
                displayItems,
            });
        };
        
        return request;
    }

    button.onclick = () => createRequest().show().then(response => response.complete("success"));
})();