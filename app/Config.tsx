import React, { useEffect } from 'react'

type inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;  
type submitHandler = (e: React.FormEvent<HTMLFormElement>) => void; 

function GameConfigForm({formData, setFormData, handleInputChange, handleSubmit, showForm, setShowForm, originalForm}: {formData: {rows: string, cols: string, numBombs: string}, setFormData: Function, handleInputChange: inputChangeHandler, handleSubmit: submitHandler, showForm: boolean, setShowForm: Function, originalForm: {rows: string, cols: string, numBombs: string}}) {
	function renderConfigInput({inputType, inputID, inputName, inputValue, minValue, maxValue}: {inputType: string, inputID: string, inputName: string, inputValue: string, minValue: string, maxValue: string}) {
		return (<input
			type={inputType}
			id={inputID}
			name={inputName}
			value={inputValue}
			onChange={handleInputChange}
			min={minValue}
			max={maxValue}
			step="1"
			className="text-right mr-10"
			style={{
				WebkitAppearance: 'none',
				MozAppearance: 'textfield',
				margin: 0
			}}
	  	/>);
	}

	function setBeginnerBoard() {
		setFormData({rows: 9, cols: 9, numBombs: 10});
	}

	function setIntermediateBoard() {
		setFormData({rows: 16, cols: 16, numBombs: 40});
	}

	function setExpertBoard() {
		setFormData({rows: 16, cols: 30, numBombs: 99});
	}


	const handleClickOutside = (event: any) => {
		const target = event.target as HTMLElement;
		const configElement = document.querySelector('.config-form');
		// Check if the click occurred outside the target element
		if (configElement && !configElement.contains(target)) {
			setShowForm(false);
			setFormData(originalForm);
		}
	  };

	useEffect(() => {
	// Add event listener when the component mounts
	document.body.addEventListener('click', handleClickOutside);

	// Remove event listener when the component unmounts
	return () => {
		document.body.removeEventListener('click', handleClickOutside);
	};
	}, [showForm]); // Only re-run the effect if showForm changes
	
	return (
	  <form onSubmit={handleSubmit}>
		<div className="max-w-xs flex flex-col">
			<div className="flex justify-between">
			<label htmlFor="rows">Rows:</label>
			{renderConfigInput({
				inputType: "number",
				inputID: "ConfigFormInputRows",
				inputName: "rows",
				inputValue: String(formData.rows),
				minValue: "1",
				maxValue: "100"
				})}
			</div>
			<div className="flex justify-between">
			<label htmlFor="cols">Columns:</label>
			{renderConfigInput({
				inputType: "number",
				inputID: "ConfigFormInputCols",
				inputName: "cols",
				inputValue: String(formData.cols),
				minValue: "1",
				maxValue: "100"
				})}
			</div>
			<div className="flex justify-between">
			<label htmlFor="numBombs">Bombs:</label>
			{renderConfigInput({
				inputType: "number",
				inputID: "ConfigFormInputNumBombs",
				inputName: "numBombs",
				inputValue: String(formData.numBombs),
				minValue: "1",
				maxValue: "10000"
				})}
			</div>
		</div>
		<div className="flex px-2 space-x-2">
			<button type="button" onClick={setBeginnerBoard} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Beginner</button>
			<button type="button" onClick={setIntermediateBoard} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Intermediate</button>
			<button type="button" onClick={setExpertBoard} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Expert</button>
		</div>
		<div className="pt-4">
			<button type="submit" className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Submit</button>
		</div>
	  </form>
	);
  
  }

export function Config({formData, setFormData, handleInputChange, handleSubmit, showForm, setShowForm, originalForm, setOriginalForm}: any) {
	return (
		<div className={`config fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${showForm ? `` : `hidden`}`}>
			<div className="config-form bg-white p-8 rounded-lg shadow-md justify-between items-center">
				<div className="text-lg flex justify-center pb-4">
				Edit Game Parameters
				</div>

			<GameConfigForm 
			formData={formData}
			setFormData={setFormData}
			handleInputChange={handleInputChange}
			handleSubmit={handleSubmit}
			showForm={showForm}
			setShowForm={setShowForm}
			originalForm={originalForm}
			/>
			</div>
		</div>
	);
}