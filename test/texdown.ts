import 'mocha';
import { expect } from 'chai';
import { texDown, Renderer, Element, Env } from '../src/texdown';


class Test implements Renderer {
    public res = ''

    startEnv = (type: Env) => {
        this.res += `<div align='center'>`
    }

    endEnv = (type: Env) => {
        this.res += `</div>`
    }

    hr = () => this.res += '<hr />'

    startElement = (type: Element) => {
        this.res += `<${type}>`
    }

    endElement = (type: Element) => {
        this.res += `</${type}>`
    }

    $$ = (tex: string) => this.res += `<$$>${tex}</$$>`
    $ = (tex: string) => this.res += `<$>${tex}</$>`

    a = (title: string, href: string) =>
        this.res += `<a href='${href}'>${title || href}</a>`
    img = (title: string, src: string) =>
        this.res += `<img title='${title}' src='${src}' />`

    txt = (val: string) => this.res += val
    tikz = (tikz: string) => this.res += `<tikz>${tikz}</tikz>`

    eol = () => { }
    blank = () => { }
}

describe('texDown', () => {
    const h6 = '###### h6'
    it(h6, () => {
        const p = new Test()
        texDown(h6, p)
        expect(p.res).to.eq(
            '<h6>h6</h6>'
        )
    })

    const h5 = '##### h5'
    it(h5, () => {
        const parser = new Test()
        texDown(h5, parser)
        expect(parser.res).to.eq(
            '<h5>h5</h5>'
        )
    })

    const b = '*b*'
    it(b, () => {
        const parser = new Test()
        texDown(b, parser)
        expect(parser.res).to.eq(
            '<p><b>b</b></p>'
        )
    })

    const i = '/i/'
    it(i, () => {
        const parser = new Test()
        texDown(i, parser)
        expect(parser.res).to.eq(
            '<p><i>i</i></p>'
        )
    })

    const u = '_u_'
    it(u, () => {
        const parser = new Test()
        texDown(u, parser)
        expect(parser.res).to.eq(
            '<p><u>u</u></p>'
        )
    })

    const p = 'do\ng'
    it(p, () => {
        const parser = new Test()
        texDown(p, parser)
        expect(parser.res).to.eq(
            '<p>dog</p>'
        )
    })

    const ul = '- i1\n- i2'
    it(ul, () => {
        const parser = new Test()
        texDown(ul, parser)
        expect(parser.res).to.eq(
            '<ul><li>i1</li><li>i2</li></ul>'
        )
    })

    const ol = '1. i1\n2. i2'
    it(ol, () => {
        const parser = new Test()
        texDown(ol, parser)
        expect(parser.res).to.eq(
            '<ol><li>i1</li><li>i2</li></ol>'
        )
    })

    const $$ = '$$\ntex\n$$\n'
    it($$, () => {
        const parser = new Test()
        texDown($$, parser)
        expect(parser.res).to.eq(
            '<$$>tex</$$>'
        )
    })

    const $ = '$tex$'
    it($, () => {
        const parser = new Test()
        texDown($, parser)
        expect(parser.res).to.eq(
            '<p><$>tex</$></p>'
        )
    })

    const a = '[tex.ninja](http://tex.ninja)'
    it(a, () => {
        const parser = new Test()
        texDown(a, parser)
        expect(parser.res).to.eq(
            "<p><a href='http://tex.ninja'>tex.ninja</a></p>"
        )
    })

    const img = '![ninja](ninja.png)'
    it(img, () => {
        const parser = new Test()
        texDown(img, parser)
        expect(parser.res).to.eq(
            "<p><img title='ninja' src='ninja.png' /></p>"
        )
    })

    const tikz = '\\begin{tikzpicture}\ntikz\n\\end{tikzpicture}'
    it(tikz, () => {
        const parser = new Test()
        texDown(tikz, parser)
        expect(parser.res).to.eq(
            '<tikz>\\begin{tikzpicture}\ntikz\n\\end{tikzpicture}</tikz>'
        )
    })

    const hr = '--'
    it(hr, () => {
        const parser = new Test()
        texDown(hr, parser)
        expect(parser.res).to.eq(
            `<hr />`
        )
    })

    const center = '\\center'
    it(center, () => {
        const parser = new Test()
        texDown(center, parser)
        expect(parser.res).to.eq(
            `<div align='center'></div>`
        )
    })

    const format = '*b*/i/_u_'
    it(format, () => {
        const parser = new Test()
        texDown(format, parser)
        expect(parser.res).to.eq(
            `<p><b>b</b><i>i</i><u>u</u></p>`
        )
    })
})