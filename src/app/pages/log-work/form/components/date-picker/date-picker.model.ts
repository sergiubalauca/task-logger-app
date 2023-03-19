export interface DatePickerYear {
	text: string;
	value: number;
	columnIndex: number;
}

export interface DatePickerMonth {
	text: string;
	value: number;
	columnIndex: number;
}

export interface DatePickerDay {
	text: string;
	value: number;
	columnIndex: number;
}

export interface DatePickerHour {
	text: string;
	value: number;
	columnIndex: number;
}

export interface DatePickerMin {
	text: string;
	value: number;
	columnIndex: number;
}

export interface DatePicker {
	year: DatePickerYear;
	month: DatePickerMonth;
	day: DatePickerDay;
	hour: DatePickerHour;
	minute: DatePickerMin;
}
