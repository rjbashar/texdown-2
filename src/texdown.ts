import * as moo from 'moo'

export type tokens =
    'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1'
    | 'b' | 'i' | 'u'
    | 'uli' | 'oli'
    | 'a' | 'img'
    | '$' | '$$'
    | 'tikz'
    | 'esc'
    | 'txt'
    | 'blank' | 'eol'

export type typeElement =
    'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1'
    | 'b' | 'i' | 'u'
    | 'p'
    | 'ul' | 'ol'
    | 'li'

export type typeVal = 'txt'

export type type =
    typeElement
    | typeVal

export type action = {
    [key in tokens]: (tkn: moo.Token) => void
}

export interface parser {
    startElement: (type: typeElement) => void
    endElement: (type: typeElement) => void
    txt: (val: string) => void
}

export function texdown<T extends parser>(markDown: string, parser: T): T {
    const lexer = moo.compile({
        h6: /^###### /
        , h5: /^##### /
        , h4: /^#### /
        , h3: /^### /
        , h2: /^## /
        , h1: /^# /
        , b: '*'
        , i: '/'
        , u: '_'
        , uli: /^\- /
        , oli: /^\d+\. /
        , a: /\[[^\]\n]*\]\([^)\n]*\)/
        , img: /!\[[^\]\n]*\]\([^)\n]*\)/
        , $$: /^\$\$$(?:\\\$|[^$])+^\$\$\n/
        , $: /\$(?:\\\$|[^\n$])+\$/
        , tikz: /\\begin\{tikzpicture\}[^]*?\\end\{tikzpicture\}/
        , esc: /\\\*|\\_|\\\$|\\\\|^\\#/
        , txt: /[^/!\n*_$\\]+|[!*_$\\/]/
        , blank: { match: /^\n/, lineBreaks: true }
        , eol: { match: /\n/, lineBreaks: true }
    })

    lexer.reset(markDown)

    const stack: typeElement[] = []
    const top = () => stack[stack.length - 1]

    const pop = () => {
        parser.endElement(stack.pop() as typeElement)
    }

    const push = (type: typeElement) => {
        stack.push(type)
        parser.startElement(type)
    }

    const newElement = (type: typeElement) => {
        stack.push(type)
        parser.startElement(type)
    }

    const del = (type: typeElement) => {
        if (top() === type) pop()
        else push(type)
    }

    const actions: action = {
        // ELEMENT
        h6: () => newElement('h6')
        , h5: () => newElement('h5')
        , h4: () => newElement('h4')
        , h3: () => newElement('h3')
        , h2: () => newElement('h2')
        , h1: () => newElement('h1')
        , b: () => del('b')
        , i: () => del('i')
        , u: () => del('u')
        , uli: () => {
            while (stack.length && top() !== 'ul') pop()
            if (top() !== 'ul') push('ul')
            push('li')
        }
        , oli: () => { }
        // LINK
        , a: () => { }
        , img: () => { }
        // MATH
        , $$: () => { }
        , $: () => { }
        // TIKZ
        , tikz: () => { }
        // ESC
        , esc: () => { }
        // VAL
        , txt: (token: moo.Token) => {
            if (!stack.length) {
                stack.push('p')
                parser.startElement('p')
            }
            parser.txt(token.text)
        }
        // EOL
        , blank: () => { }
        , eol: () => {
            while (
                stack.length
                && top() !== 'p'
                && top() !== 'li') pop()
        }
    }

    while (true) {
        const token = lexer.next()
        if (token === undefined) break
        actions[token.type as tokens](token)
    }

    while (stack.length) {
        parser.endElement(stack.pop() as typeElement)
    }

    return parser
}               