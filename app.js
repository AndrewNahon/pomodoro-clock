
var clock = {
  runTimer: false,
  phase: 'session',
  formatTime: function(time) {
    var minutes, seconds;

    minutes = Math.floor( +time / 60 );
    seconds = +time % 60;

    minutes = ('' + minutes).length < 2 ? '0' + minutes : '' + minutes;
    seconds = ('' + seconds).length < 2 ? '0' + seconds : '' + seconds;

    return minutes + ':' + seconds;
  },
  getRemainingTime: function() {
    var time = $('#timer').text();
    var min, secs;
    if ( time.includes(':') ) {
      min = +time.split(':')[0];
      sec = +time.split(':')[1];
      return 60 * min + sec;
    } else {
      return +time * 60
    }
  },
  changePhase: function() {
    clock.phase = ( clock.phase === 'session')  ? 'break' : 'session';

    if ( clock.phase === 'session' ) {
      clock.startSession();
    } else {
      clock.startBreak();
    }
  },
  startSession: function() {
    $('#dial').removeClass().addClass('session-time');
    $('#phase').text('Session');
    $("#timer").text( $('.session-time-amount').text() );

    clock.startTimer();
  },
  startBreak: function() {
    $('#dial').removeClass().addClass('break-time');
    $('#phase').text('Break');
    $("#timer").text( $('.break-time-amount').text() );

    clock.startTimer();
  },
  startTimer: function() {
    clock.runTimer = !clock.runTimer;

    var timeInSec = clock.getRemainingTime();
    var startTimer = setInterval(function() {

                      if ( !clock.runTimer ) {
                        clearInterval( startTimer );
                        return;
                      }

                      if ( timeInSec === 0 ) {
                        document.getElementById('chime').play();
                        clearInterval( startTimer );
                        clock.runTimer = !clock.runTimer;
                        clock.changePhase();
                      } else {
                        timeInSec--;
                        $('#timer').html( clock.formatTime( timeInSec ) );
                      }
    }, 1000);
  },
  changeSessionTime: function(e) {
    e.preventDefault();
    if (clock.runTimer ) { return; }
    var symbol = $(e.target).text(),
        $setterTime = $('.session-time-amount'),
        $timer = $('#timer'),
        currentTime = $setterTime.text();

    if (symbol === '-') {
      if ( currentTime <= 1 ) { return; }
      currentTime = +currentTime - 1;
    } else {
      currentTime = +currentTime + 1;
    }
    $setterTime.text(currentTime);

    if ( clock.phase !== 'break' ) {
      $timer.text(currentTime);
    }
  },
  changeBreakTime: function(e) {
    e.preventDefault();
    if ( clock.runTimer ) { return; }
    var symbol = $(e.target).text();
    var $breakTime = $(".break-time-amount"),
        currentTime =  +$breakTime.text();
    if (symbol === '-') {
      if ( currentTime === 1 ) { return; }
      $breakTime.text( currentTime - 1);
    } else {
      $breakTime.text( currentTime + 1 );
    }
  },
  bindEvents: function() {
    $('.session .setter').on('click', this.changeSessionTime);
    $('.break .setter').on('click', this.changeBreakTime);
    $('#dial').on('click', this.startTimer);
  },
  init: function() {
    this.bindEvents();
  }
}
