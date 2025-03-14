import React, { useState, useRef, useEffect } from 'react'
import TagDropdown from './TagDropdown'
import { FormulaTagData } from '../../types/formula'
import './FormulaTag.css'

type FormulaTagProps = {
    tag: FormulaTagData
    onRemove: () => void
    onEdit?: (tag: FormulaTagData) => void
}

const FormulaTag: React.FC<FormulaTagProps> = ({ tag, onRemove, onEdit }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const tagRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside the tag
    useEffect(() => {
        if (!showDropdown) return

        const handleClickOutside = (event: MouseEvent) => {
            if (
                tagRef.current &&
                !tagRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showDropdown])

    // Handler for highlighting the tag on hover
    const handleMouseEnter = () => {
        tagRef.current?.classList.add('formula-tag-hover')
    }

    const handleMouseLeave = () => {
        tagRef.current?.classList.remove('formula-tag-hover')
    }

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDropdown(!showDropdown)
    }

    return (
        <div
            className="formula-tag"
            ref={tagRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="tag-content">
                <span className="tag-name">{tag.name}</span>
                <button
                    className="tag-dropdown-toggle"
                    onClick={toggleDropdown}
                    aria-label="Toggle tag options"
                >
                    ▼
                </button>
            </div>

            {showDropdown && (
                <TagDropdown
                    tag={tag}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    onClose={() => setShowDropdown(false)}
                />
            )}
        </div>
    )
}

export default FormulaTag
