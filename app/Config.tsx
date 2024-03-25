import React from 'react'

type inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;  
type submitHandler = (e: React.FormEvent<HTMLFormElement>) => void; 

function GameConfigForm({formData, handleInputChange, handleSubmit}: {formData: {rows: string, cols: string, numBombs: string}, handleInputChange: inputChangeHandler, handleSubmit: submitHandler}) {
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
	  	/>);
	}
	
	return (
	  <form onSubmit={handleSubmit}>
		<div>
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
		<div>
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
		<div>
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
		<button type="submit">Submit</button>
	  </form>
	);
  
  }

export function Config({formData, handleInputChange, handleSubmit}: any) {
	return (
		<div className="config">
			<button>Edit Game Parameters</button>
			<GameConfigForm 
			formData={formData}
			handleInputChange={handleInputChange}
			handleSubmit={handleSubmit}
			/>
		</div>
	);
}