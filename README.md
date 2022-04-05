![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![npm version](https://badge.fury.io/js/lugath.svg)

# @lugath/node
Wrapper for Lugath public API's.

Please see the **Lugath Help Center** for SDK usage and configuration **documentation.**

## Requirements

Node.js 8 or Higher

## Installation

You can install via **npm** or **yarn**

    $ npm install lugath
or 

    $ yarn add lugath

## Usage

Here is a basic example to use Lugath;

    const Lugath =  require('lugath');

Lugath API uses OAuth to authenticate requests. You can view and manage your API key in the account Dashboard. 

![enter image description here](https://s3.us-west-2.amazonaws.com/docs.lugath.com/static/LugathClientKeysScreen.png)


Don’t have an account yet? You can register [here](https://www.lugath.com/).

### Simple Usage Example
You need to pass your API credentials as option to constructor.

    const  options  = {
           API_KEY  :  "<YOUR_API_KEY>",
           API_SECRET  :  "<YOUR_SECRET_KEY>"
    }
    
    const  lugath  =  new  Lugath(options);


This will manage your authentication process backward. Now you're able to translate a text, from a pair to multiple pairs with category context as you see below;

 
       
       lugath.translate({
		      "from":"en",
		      "to":["fr"],
		      "text":"a sample text to translate",
		      "category":"<CategoryOptions>",
		      "options":{
			        "glossaryIDs":[],
			        "useBestMatch":false,
			        "customMTEngineName":""
		      }
	    }).then((res) => console.log(res))
	    


### API Options

    from: String
The source language of translate context.
> Note: This won't be blank.

    to: Array
The target language(s) of translate context.
> Note: This won't be blank, assignable multiple values.


    text: String
The text you want to translate.
> Note: This won't be blank.

    category: String
The context of the text to translate.
> Note: This won't be blank. You can check the **available options section as below**

    glossaryIDs: Array
Relating to a specific terms in the translate text reserved or not, replaced or not.
> Note: If a terminology set already created on the dashboard, you can specify them with this field.

    useBestMatch: Boolean
Machine Translation Engines rated by Lugath with the context of category and language pair. 
> Note: If you don't interest with useBestMatch, you can get results directly from a specific MT.

    customMTEngineName: String
You can specifically go to assigned MT with this field. 
> Note: If you don't interest with useBestMatch, this field is mandatory.


## Available Options

| Language       |Code                           |Code3                         |
|----------------|-------------------------------|-----------------------------|
|Arabic|ar|ara|
|Chinese|zh|zh|
|Dutch|nl|nld|
|English|en|eng|
|Finnish	|fi|fin|
|French	|fr|fra|
|German|de|deu|
|Japanese|ja|jpn|
|Korean|ko|kor|
|Polish|pl|pol|
|Portuguese|pt|por|
|Romanian|ro|ron|
|Russian|ru|rus|
|Spanish	|es|spa|
|Turkish|tr|tur|



|Available Categories|
|--|
|Automotive|
|Computer Hardware|
|Computer Software|
|Consumer Electronics|
|Finance|
|Healthcare|
|Tourism and Arts|
|Business Services|
|Other|

|Available MT Engines|
|--|
|AmazonTranslationEngine|
|GoogleTranslationEngine|
|YandexTranslationEngine|
|ModernTranslationEngine|
|MicrosoftTranslationEngine|
|AlibabaECommerceTranslationEngine|
|AlibabaGeneralTranslationEngine|

## Contribute

Forks and pull requests welcome!

## Author

Supported and maintained by  [Lugath Developers](https://lugath.com/). If you need any questions, just drop us a line.
