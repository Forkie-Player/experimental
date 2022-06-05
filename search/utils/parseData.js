function addRest(views) {
   let cnt = 0;
   for (let i = views.length - 1; i >= 0; i--) {
      cnt++;
      if (cnt % 3 === 0 && i !== 0) {
         views = views.slice(0, i) + "," + views.slice(i);
      }
   }
   return views;
}

exports.parseViews = function (views) {
   if (views >= 100000000) {
      return `${addRest(Math.floor(views / 100000000).toString())}억`;
   } else if (views >= 10000) {
      return `${addRest(Math.floor(views / 10000).toString())}만`;
   } else {
      return `${addRest(views.toString())}`;
   }
};

exports.parseDuration = function (duration) {
   let sec_num = duration;
   let hours = Math.floor(sec_num / 3600);
   let minutes = Math.floor((sec_num - hours * 3600) / 60);
   let seconds = sec_num - hours * 3600 - minutes * 60;

   let hoursString = "";
   if (hours !== 0) {
      hoursString += hours + ":";
      minutes = minutes < 10 ? "0" + minutes : minutes;
      hoursString += minutes + ":";
      seconds = seconds < 10 ? "0" + seconds : seconds;
      hoursString += seconds;
   } else if (minutes !== 0) {
      hoursString += minutes + ":";
      seconds = seconds < 10 && minutes !== 0 ? "0" + seconds : seconds;
      hoursString += seconds;
   } else if (seconds !== 0) {
      hoursString += seconds;
   }

   return hoursString;
};

exports.parseDate = function (date) {
   const offset = date.getTimezoneOffset();
   date = new Date(date.getTime() - offset * 60 * 1000);
   return date.toISOString().split("T")[0];
};
