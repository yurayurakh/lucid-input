import React, { useRef, useState, useEffect } from 'react'
import { useFormulaStore } from '../../store/formulaStore'
import { useAutocomplete } from '../../hooks/useAutocomplete'
import FormulaTag from './FormulaTag'
import AutocompleteDropdown from './AutocompleteDropdown'
import { FormulaTagData, isOperator } from '../../types/formula'
import './FormulaInput.css'

const FormulaInput: React.FC = () => {
    const {
        items,
        input,
        setInput,
        addItem,
        removeItem,
        calculateResult,
        result,
        error
    } = useFormulaStore()

    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const { items: autocompleteItems, isLoading } = useAutocomplete(input)

    // Focus on input when component mounts
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Focus on input when clicking on container
    const handleContainerClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            inputRef.current?.focus()
        }
    }

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        // If an operator is entered, add it immediately
        if (value.length === 1 && isOperator(value)) {
            addItem({ type: 'operator', value })
            return
        }

        setInput(value)

        if (value.trim().length > 0) {
            setShowAutocomplete(true)
        } else {
            setShowAutocomplete(false)
        }
    }

    // Handle selection from autocomplete
    const handleSelectItem = (item: FormulaTagData) => {
        addItem({
            type: 'tag',
            tag: item
        })
        setShowAutocomplete(false)

        // Focus on input after tag insertion
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)

        // Calculate result after adding an element
        calculateResult()
    }

    // Handle key presses
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Backspace pressed and input is empty -> delete the last tag
        if (e.key === 'Backspace' && input === '' && items.length > 0) {
            removeItem(items.length - 1)
            calculateResult()
            return
        }

        // Operator key pressed -> create an operator
        if (isOperator(e.key) && !showAutocomplete) {
            e.preventDefault()
            addItem({ type: 'operator', value: e.key })
            calculateResult()
            return
        }

        // When Enter is pressed
        if (e.key === 'Enter') {
            e.preventDefault()

            // If autocomplete is open and has items - select the first one
            if (showAutocomplete && autocompleteItems.length > 0) {
                handleSelectItem(autocompleteItems[0])
                return
            }

            // Check if input is a number
            if (input.trim()) {
                const num = parseFloat(input)
                if (!isNaN(num)) {
                    addItem({ type: 'number', value: num })
                    calculateResult()
                }
            }
        }
    }

    // Function to render formula content
    const renderFormulaContent = () => {
        return items.map((item, index) => {
            if (item.type === 'tag') {
                return (
                    <FormulaTag
                        key={`tag-${index}`}
                        tag={item.tag}
                        onRemove={() => {
                            removeItem(index)
                            calculateResult()
                        }}
                    />
                )
            } else if (item.type === 'operator') {
                return (
                    <span key={`op-${index}`} className="formula-operator">
                        {item.value}
                    </span>
                )
            } else if (item.type === 'number') {
                return (
                    <span key={`num-${index}`} className="formula-number">
                        {item.value}
                    </span>
                )
            }
            return null
        })
    }

    return (
        <div className="formula-wrapper">
            <div
                className="formula-input-container"
                ref={containerRef}
                onClick={handleContainerClick}
            >
                <div className="formula-content">
                    {renderFormulaContent()}
                    <input
                        ref={inputRef}
                        type="text"
                        className="formula-text-input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            items.length === 0 ? 'Enter formula...' : ''
                        }
                    />
                </div>

                {showAutocomplete && (
                    <AutocompleteDropdown
                        items={autocompleteItems}
                        loading={isLoading}
                        onSelect={handleSelectItem}
                        onClose={() => setShowAutocomplete(false)}
                        searchTerm={input}
                    />
                )}
            </div>

            {(result !== null || error) && (
                <div className="formula-result">
                    {error ? (
                        <div className="formula-error">{error}</div>
                    ) : (
                        <div className="formula-result-value">
                            Result: {result}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FormulaInput
