import React from 'react'
import { FormulaTagData } from '../../types/formula'
import './TagDropdown.css'

type TagDropdownProps = {
    tag: FormulaTagData
    onRemove: () => void
    onClose: () => void
    onEdit?: (tag: FormulaTagData) => void
}

const TagDropdown: React.FC<TagDropdownProps> = ({
    tag,
    onRemove,
    onClose,
    onEdit
}) => {
    // Handler for removing with dropdown closure
    const handleRemove = () => {
        onRemove()
        onClose()
    }

    // Close dropdown when pressing Escape
    React.useEffect(() => {
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

    return (
        <div className="tag-dropdown">
            <div className="tag-dropdown-header">
                <span>{tag.name}</span>
                <button
                    onClick={onClose}
                    className="close-button"
                    aria-label="Close dropdown"
                >
                    ✕
                </button>
            </div>

            <div className="tag-dropdown-content">
                <div className="tag-info-row">
                    <span>Category:</span>
                    <span>{tag.category}</span>
                </div>
                <div className="tag-info-row">
                    <span>Value:</span>
                    <span>{tag.value.toString()}</span>
                </div>
            </div>

            <div className="tag-dropdown-actions">
                {onEdit && (
                    <button onClick={() => onEdit(tag)} className="edit-button">
                        Edit
                    </button>
                )}
                <button onClick={handleRemove} className="remove-button">
                    Remove
                </button>
            </div>
        </div>
    )
}

export default TagDropdown
