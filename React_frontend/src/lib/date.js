// 요일 구해주는 함수
export const getDayOfWeek = (day) => {
	if (day === null) {
		return;
	}

	const week = ['일', '월', '화', '수', '목', '금', '토'];
	const dayOfWeek = week[new Date(day).getDay()];
	return dayOfWeek;
}

// js 날짜를 String으로 변경하는 함수(YYYY-MM-DD)
export const DateToString = (date) => {
	if (date === null) {
		return;
	}

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;

	return year + '-' + month + '-' + day;
}

// js 날짜를 String으로 변경하는 함수(YYYY-MM-DD HH:mm)
export const DateToString2 = (date) => {
	if (date === null) {
		return;
	}

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	
	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;

	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

// 영화 시작 시간을 골랐을 때 종료 시간을 계산해주는 함수
export const DateCal = (old_date, addminute) => {
	if (old_date === null) {
		return;
	}
	
	// 상영시간만큼 시간 더하기
	var date = new Date(old_date);
	date.setMinutes(date.getMinutes() + addminute);

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	
	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;

	return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

// 작성 시간을 변경해주는 함수
export const detailDate = (date) => {
	const milliSeconds = new Date() - date;

	const seconds = milliSeconds / 1000;
	if (seconds < 60) return `방금 전`;

	const minutes = seconds / 60;
	if (minutes < 60) return `${Math.floor(minutes)}분 전`;

	const hours = minutes / 60;
	if (hours < 24) return `${Math.floor(hours)}시간 전`;

	const days = hours / 24;
	if (days < 7) return `${Math.floor(days)}일 전`;

	const weeks = days / 7;
	if (weeks < 5) return `${Math.floor(weeks)}주 전`;

	const months = days / 30;
	if (months < 12) return `${Math.floor(months)}개월 전`;

	const years = days / 365;
	return `${Math.floor(years)}년 전`;
};