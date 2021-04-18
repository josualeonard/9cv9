import React from "react";
import './style/app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "xxxxx xxxxx",
      number: "xxxx xxxx xxxx xxxx",
      type: "mastercard",
      exp: "xx/xx",
      cvv: "",
      selectStart: 0,
      selectEnd: 0
    };
    
    this.generate = this.generate.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.inputNumber = this.inputNumber.bind(this);
    this.inputName = this.inputName.bind(this);
    this.inputExp = this.inputExp.bind(this);
    this.inputCVV = this.inputCVV.bind(this);
    
    this.number = React.createRef();
  }

  random(min, max) {
    return Math.round((Math.random() * (max - min)) + min,1);
  }

  getTypeByFirstDigit(digit) {
    if(digit===4) return "visa";
    if(digit===5) return "mastercard";
    return "";
  }

  generate(e) {
    let firstDigit = this.random(4,5);
    let type = this.getTypeByFirstDigit(firstDigit);
    let number = firstDigit.toString();
    for(let i=2;i<=16;i++) {
      number += this.random(0,9).toString();
      if(i%4===0) number += " ";
    }
    this.setState({
      number: number,
      type: type
    }, () => {
      this.number.current.value = number;
    });
  }

  maskNumber(value,unmaskStartPos) {
    let newValue = "";

    for(var i = 0; i < 16; i++) {
      if(i > 0 && i % 4 === 0) {
        newValue += " ";
      }
      if(i<value.length) {
        if(i<=unmaskStartPos) newValue += value[i];
        else if(!isNaN(value[i+1])) newValue += value[i+1];
        else newValue += "x";
      }
      else newValue += "x";
    }
    return newValue;
  }

  maskName(value,unmaskStartPos) {
    let newValue = "";

    let nameSp = value.split(" ");
    if(nameSp.length>1) {
      if(nameSp[0].length>5) {
        newValue += nameSp[0].substr(0,5)+" "+(nameSp[0].substr(5,nameSp[0].length-5)+nameSp[1]).substr(0,5);
      } else newValue += nameSp[0]+" "+nameSp[1].substr(0,5);
    } else if(value.length>5) {
      if(value.length>5) newValue += value.substr(0,5)+" "+value.substr(5,value.length-5);
    } else {
      newValue = value;
    }
    return newValue;
  }

  maskExp(value,unmaskStartPos) {
    let newValue = "";

    for(var i = 0; i < 4; i++) {
      if(i > 0 && i % 2 === 0) {
        newValue += "/";
      }
      if(i<value.length) {
        if(i<=unmaskStartPos) newValue += value[i];
        else if(!isNaN(value[i+1])) newValue += value[i+1];
      }
      else newValue += "x";
    }
    return newValue;
  }

  unmaskNumber(value) {
    var output = value.replace(new RegExp(/[^\dx]/, 'g'), '');
    return output;
  }

  unmaskName(value) {
    var output = value.replace(new RegExp(/[^a-zA-Z ]/, 'g'), '');
    return output;
  }

  unmaskExp(value) {
    var output = value.replace(new RegExp(/[^\dx\\]/, 'g'), '');
    return output;
  }

  unmaskCVV(value) {
    var output = value.replace(new RegExp(/[^\d]/, 'g'), '');
    return output;
  }
  
  inputNumber(e) {
    let el = e.target;
    let newCursorPosition = 0;
    let selectStart = this.state.selectStart;
    let selectEnd = this.state.selectEnd;
    let newValue = this.unmaskNumber(el.value);

    // Replace & don't push existing value
    let unmaskStartPos = selectStart;
    if(selectStart>=15) unmaskStartPos -= 3;
    else if(selectStart>=10) unmaskStartPos -= 2;
    else if(selectStart>=5) unmaskStartPos -= 1;
    newValue = this.maskNumber(newValue, unmaskStartPos);

    newCursorPosition = selectStart + 1;
    if(selectStart===4 || selectStart===9 || selectStart===14) newCursorPosition++;
    if(selectStart!==selectEnd) newCursorPosition = selectEnd;
    if(newCursorPosition>newValue.length) newCursorPosition = newValue.length;

    this.setState({
      number: newValue,
      type: this.getTypeByFirstDigit(parseInt(newValue.substr(0,1)))
    }, () => {
      el.value = newValue;
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }
  
  inputName(e) {
    let el = e.target;
    let newCursorPosition = 0;
    let selectStart = this.state.selectStart;
    let selectEnd = this.state.selectEnd;
    let originalValue = el.value;
    let newValue = this.unmaskName(originalValue);

    // Replace & don't push existing value
    let unmaskStartPos = selectStart;
    if(selectStart>=6) unmaskStartPos -= 1;
    newValue = this.maskName(newValue, unmaskStartPos);

    newCursorPosition = selectStart + 1;
    let nameSp = originalValue.split(" ");
    if((nameSp.length<=1 && originalValue.length>5) || (unmaskStartPos===5 && nameSp[0].length>5)) {
      newCursorPosition++;
    }

    if(selectStart!==selectEnd) newCursorPosition = selectEnd;
    if(newCursorPosition>newValue.length) newCursorPosition = newValue.length;

    this.setState({
      name: newValue
    }, () => {
      el.value = newValue;
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }
  
  inputExp(e) {
    let el = e.target;
    let newCursorPosition = 0;
    let selectStart = this.state.selectStart;
    let selectEnd = this.state.selectEnd;
    let newValue = this.unmaskExp(el.value);

    // Replace & don't push existing value
    let unmaskStartPos = selectStart;
    if(selectStart>=3) unmaskStartPos -= 1;
    newValue = this.maskExp(newValue, unmaskStartPos);

    newCursorPosition = selectStart + 1;
    if(selectStart===2) newCursorPosition++;
    if(selectStart!==selectEnd) newCursorPosition = selectEnd;
    if(newCursorPosition>newValue.length) newCursorPosition = newValue.length;

    this.setState({
      exp: newValue
    }, () => {
      el.value = newValue;
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }
  
  inputCVV(e) {
    let el = e.target;
    let newCursorPosition = 0;
    let selectStart = this.state.selectStart;
    let newValue = this.unmaskCVV(el.value);

    newCursorPosition = selectStart + 1;

    this.setState({
      cvv: newValue
    }, () => {
      el.value = newValue;
      el.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }

  keyDown(e) {
    let t = e.target;
    this.setState({
      selectStart: t.selectionStart,
      selectEnd: t.selectionEnd
    });
  }

  render() {
    let cardFirstDigit = this.state.number.charAt(0);
    let cardType = this.state.type;
    let cardClass = (cardFirstDigit!=="x" && cardType==="")?"error":"";

    let expClass = "";
    let exp = this.state.exp;
    let expSp = exp.split("/");
    if(expSp[0]!=="xx" && expSp[1]!=="xx") {
      let month = parseInt(expSp[0]);
      let year = parseInt(expSp[1]);
      if(month<0 || month>12 || year<21) expClass = "error";
    }

    return (
      <div className="container">
        <div className="card">
          <div className="rounded-bg"></div>
          <div className="chip"></div>
          <div className={"logo "+this.state.type}></div>
          <div className="number-label">card number</div>
          <div id="number-value" className="number-value">{this.state.number}</div>
          <div className="name-label">cardholder name</div>
          <div id="name-value" className="name-value">{this.state.name.toLowerCase()}</div>
          <div className="exp-label">expiration</div>
          <div className="valid-label">valid</div>
          <div className="thru-label">thru</div>
          <div className="arrow-label"></div>
          <div id="exp-value" className="exp-value">{this.state.exp}</div>
        </div>
        <form className="form">
          <div className="input-line">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" defaultValue={this.state.name} placeholder="Bruce Wayne" autoComplete="off" onKeyDown={this.keyDown} onInput={this.inputName}></input>
          </div>
          <div className="input-line">
            <button type="button" className="generate" onClick={this.generate}>generate random</button>
            <label htmlFor="card-number">Card Number</label>
            <input ref={this.number} id="card-number" type="text" className={cardClass} defaultValue={this.state.number} placeholder="5300 1231 2312 3123" autoComplete="off" onKeyDown={this.keyDown} onInput={this.inputNumber}></input>
            <div className={"logo-small "+this.state.type}></div>
          </div>
          <div className="input-line split">
            <div className="input-line">
              <label htmlFor="expiration">Expiration (mm/yy)</label>
              <input id="expiration" type="text" className={expClass} defaultValue="xx/xx" placeholder="05/20" autoComplete="off" onKeyDown={this.keyDown} onInput={this.inputExp}></input>
            </div>
            <div className="input-line">
              <label htmlFor="cvv">Security Code</label>
              <input id="cvv" type="password" defaultValue="" placeholder="123" maxLength={3} onKeyDown={this.keyDown} onInput={this.inputCVV}></input>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
