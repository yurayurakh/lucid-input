import React, { useEffect, useRef } from 'react'
import { AutocompleteItem } from '../../types/formula'
import './AutocompleteDropdown.css'

type AutocompleteDropdownProps = {
    items: AutocompleteItem[]
    loading: boolean
    onSelect: (item: AutocompleteItem) => void
    onClose: () => void
    searchTerm?: string
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
    items,
    loading,
    onSelect,
    onClose,
    searchTerm = ''
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    // Function to highlight found text
    const highlightText = (text: string) => {
        if (!searchTerm) return text

        // Escape special regex characters in searchTerm
        const escapedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        )

        const parts = text.split(new RegExp(`(${escapedSearchTerm})`, 'gi'))
        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <strong key={index}>{part}</strong>
                    ) : (
                        part
                    )
                )}
            </>
        )
    }

    if (loading) {
        return (
            <div className="autocomplete-dropdown" ref={dropdownRef}>
                <div className="autocomplete-loading">Loading...</div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="autocomplete-dropdown" ref={dropdownRef}>
                <div className="autocomplete-empty">No results found</div>
            </div>
        )
    }

    return (
        <div className="autocomplete-dropdown" ref={dropdownRef}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className="autocomplete-item"
                    onClick={() => onSelect(item)}
                >
                    <div className="item-name">{highlightText(item.name)}</div>
                    <div className="item-category">
                        {highlightText(item.category)}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AutocompleteDropdown
