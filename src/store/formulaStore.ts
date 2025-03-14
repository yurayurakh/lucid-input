import { create } from 'zustand'
import { FormulaItem } from '../types/formula'

interface FormulaState {
    items: FormulaItem[]
    input: string
    cursorPosition: number
    result: number | null
    error: string | null

    // Actions
    setInput: (input: string) => void
    setCursorPosition: (position: number) => void
    addItem: (item: FormulaItem) => void
    removeItem: (index: number) => void
    replaceItemAtIndex: (index: number, item: FormulaItem) => void
    insertItemAtIndex: (index: number, item: FormulaItem) => void
    clearFormula: () => void
    calculateResult: () => void
}

export const useFormulaStore = create<FormulaState>((set, get) => ({
    items: [],
    input: '',
    cursorPosition: 0,
    result: null,
    error: null,

    setInput: (input) => set({ input }),

    setCursorPosition: (position) => set({ cursorPosition: position }),

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
            input: ''
        })),

    removeItem: (index) =>
        set((state) => ({
            items: state.items.filter((_, i) => i !== index)
        })),

    replaceItemAtIndex: (index, item) =>
        set((state) => ({
            items: state.items.map((oldItem, i) =>
                i === index ? item : oldItem
            )
        })),

    insertItemAtIndex: (index, item) =>
        set((state) => ({
            items: [
                ...state.items.slice(0, index),
                item,
                ...state.items.slice(index)
            ]
        })),

    clearFormula: () =>
        set({ items: [], input: '', result: null, error: null }),

    calculateResult: () => {
        const { items } = get()
        try {
            // Convert formula to an expression that can be calculated
            const expression = items
                .map((item) => {
                    switch (item.type) {
                        case 'tag':
                            return item.tag.value.toString()
                        case 'operator':
                            return item.value
                        case 'number':
                            return item.value.toString()
                        default:
                            return ''
                    }
                })
                .join(' ')

            if (!expression.trim()) {
                set({ result: null, error: null })
                return
            }

            const result = new Function(`return ${expression}`)()
            set({
                result: typeof result === 'number' ? result : null,
                error: null
            })
        } catch (error) {
            console.error('Calculation error:', error)
            set({
                result: null,
                error:
                    error instanceof Error ? error.message : 'Calculation error'
            })
        }
    }
}))
