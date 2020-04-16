const gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    browserSync = require('browser-sync');

// default permet d'appeler de lancer la tâche avec simplement "gulp" comme commande
gulp.task('default', function(done) {
    console.log('Gulp first task');
    done();
});

gulp.task('connect', function(){
    connect.server({}, function() {
        browserSync({
            proxy: '127.0.0.1:8080'
        });
    });

    gulp.watch('**/*.{php,html}').on('change', function() {
        browserSync.reload();
    })
});

gulp.task('concatJs', function(done) {
    gulp.src('gulp/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
    done();
});

gulp.task('watch', function() {
    gulp.watch('gulp/js/*.js', gulp.series('concatJs')).on('change', function(event) {
        console.log('Le fichier ' + event + ' a été modifié');
    })
});

