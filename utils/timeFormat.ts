export default function timeFormat(seconds: number) {
  // initialize sec_num with the input seconds
  let sec_num = seconds;

  // calculate hours by dividing sec_num by 3600 and flooring the result
  let hours = Math.floor(sec_num / 3600);

  // calculate minutes by subtracting hours in seconds from sec_num, then dividing by 60 and flooring the result
  let minutes = Math.floor((sec_num - hours * 3600) / 60);

  // calculate remaining seconds by subtracting hours and minutes in seconds from sec_num
  let remainingSeconds = sec_num - hours * 3600 - minutes * 60;

  // return the formatted time string with hours, minutes, and rounded remaining seconds, each padded to 2 digits
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${Math.round(remainingSeconds).toString().padStart(2, '0')}`;
}
