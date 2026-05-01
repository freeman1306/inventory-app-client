import React from 'react';

interface ProductTypeFilterProps {
	types: string[];
	selectedType: string;
	onTypeChange: (type: string) => void;
}

function ProductTypeFilter({ types, selectedType, onTypeChange }: ProductTypeFilterProps) {
	return (
		<div className="mb-4">
			<label className="form-label fw-semibold">Фильтр по типу:</label>
			<select
				className="form-select w-auto"
				value={selectedType}
				onChange={(e) => onTypeChange(e.target.value)}
			>
				<option value="all">Все типы</option>
				{types.map((type) => (
					<option key={type} value={type}>{type}</option>
				))}
			</select>
		</div>
	);
}

export default ProductTypeFilter;