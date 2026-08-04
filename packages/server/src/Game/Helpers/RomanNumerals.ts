export default class RomanNumerals {
    constructor(private readonly value: number) {
        
    }

    public toString() {
        if (isNaN(this.value)) {
            return NaN;
        }

        const digits = String(+this.value).split("");

        const key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM", "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC", "","I","II","III","IV","V","VI","VII","VIII","IX"];

        let roman = "";
        
        let index = 3;

        while (index--) {
            roman = (key[+digits.pop()! + (index * 10)] || "") + roman;
        }

        return Array(+digits.join("") + 1).join("M") + roman;
    }
}
