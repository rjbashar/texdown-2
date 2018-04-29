import 'mocha';
import { expect } from 'chai';
import { texdown, parser, typeElement } from '../src/texdown';


class Parser implements parser {
    public res = ''

    startElement = (type: typeElement) => {
        this.res += `<${type}>`
    }

    endElement = (type: typeElement) => {
        this.res += `</${type}>`
    }

    txt = (val: string) => this.res += val
}

describe('texdown', () => {
    const h6 = '###### h6'
    it(h6, () => {
        expect(texdown(h6, new Parser()).res).to.eq(
            '<h6>h6</h6>'
        )
    })

    const h5 = '##### h5'
    it(h5, () => {
        expect(texdown(h5, new Parser()).res).to.eq(
            '<h5>h5</h5>'
        )
    })

    const b = '*b*'
    it(b, () => {
        expect(texdown(b, new Parser()).res).to.eq(
            '<b>b</b>'
        )
    })

    const i = '/i/'
    it(i, () => {
        expect(texdown(i, new Parser()).res).to.eq(
            '<i>i</i>'
        )
    })

    const u = '_u_'
    it(u, () => {
        expect(texdown(u, new Parser()).res).to.eq(
            '<u>u</u>'
        )
    })

    const p = 'p'
    it(p, () => {
        expect(texdown(p, new Parser()).res).to.eq(
            '<p>p</p>'
        )
    })

    const ul = '- i1\n- i2'
    it(ul, () => {
        expect(texdown(ul, new Parser()).res).to.eq(
            '<ul><li>i1</li><li>i2</li></ul>'
        )
    })

    const ol = '1. i1\n2. i2'
    it(ol, () => {
        expect(texdown(ol, new Parser()).res).to.eq(
            '<ol><li>i1</li><li>i2</li></ol>'
        )
    })
})