const gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    nano = require('gulp-cssnano'),
    less = require('gulp-less'),
    pipeline = require('readable-stream').pipeline,
    concat = require('gulp-concat'),
    pleeease = require('gulp-pleeease'),
    connect = require('gulp-connect'),
    browserSync = require('browser-sync');

// default permet d'appeler de lancer la tâche avec simplement "gulp" comme commande
gulp.task('default', function(done) {
    console.log('Gulp first task');
    done();
});

/*
    Transpile le js ES6 en ES5, concat les fichiers js et le minifie
 */
gulp.task('Js', function() {
    return gulp.src('gulp/js/*.js')
        // rend le js compatible avec tout les navigateurs (ES5)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // compile tous les fichiers js en 'all.js'
        .pipe(concat('all.js'))
        // permet de uglify le js
        .pipe(uglify())
        // précise la destination
        .pipe(gulp.dest('dist/js'));
});

/*
    transforme le CSS3 en CSS2 et le minifie
 */
gulp.task('Css', function() {
    return pipeline(
        gulp.src('gulp/css/*.css'),
        pleeease(),
        concat('all.min.css'),
        gulp.dest('dist/css')
    )
});

/*
    Transforme le scss en css et le nano
 */
gulp.task('Scss', function() {
    return pipeline(
        gulp.src('gulp/scss/*.scss'),
        sass(),
        nano(),
        gulp.dest('gulp/css')
    )
});

/*
    Transforme le less en css
 */
gulp.task('Less', function() {
    return pipeline(
        gulp.src('gulp/less/*.less'),
        less(),
        concat('style3.css'),
        gulp.dest('gulp/css')
    )
});

gulp.task('connect', function(){
    connect.server({}, function() {
        browserSync({
            proxy: '127.0.0.1:8080'
        });
    });

    // Permet le rechargement automatique du navigateur à chaque modifications de fichiers html
    gulp.watch('**/*.{php,html}').on('change', function() {
        browserSync.reload();
    });

    gulp.watch('gulp/js/*.js', gulp.series('Js'));
    gulp.watch('gulp/css/*.css', gulp.series('Css'));
    gulp.watch('gulp/less/*.less', gulp.series('Less'));
    gulp.watch('gulp/scss/*.scss', gulp.series('Scss'));
});

gulp.task('watch', function() {
    gulp.watch('gulp/js/*.js', gulp.series('concatJs')).on('change', function(event) {
        console.log('Le fichier ' + event + ' a été modifié');
    })
});

/*
    install gulp-babel :
    # Babel 7
    npm install --save-dev gulp-babel @babel/core @babel/preset-env

    # Babel 6
    npm install --save-dev gulp-babel@7 babel-core babel-preset-env

    # A ajouter
    npm install --save-dev gulp-babel@8.0.0

    install uglify :
    npm install --save-dev gulp-uglify

    install cssnano :
    npm install gulp-cssnano --save-dev



 */
