const gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    nano = require('gulp-cssnano'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    image = require('gulp-image'),
    sourcemaps = require('gulp-sourcemaps'),
    pipeline = require('readable-stream').pipeline,
    concat = require('gulp-concat'),
    pleeease = require('gulp-pleeease'),
    connect = require('gulp-connect'),
    browserSync = require('browser-sync');

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
        // Permet de reset le css pour avoir tous les fichiers séparer dans le navigateur (pour le dev)
        sourcemaps.init(),
        pleeease(),
        concat('all.min.css'),
        sourcemaps.write('.'),
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
        less().on('error', function(error) {
            console.log(error.message);
        }),
        concat('style3.css'),
        gulp.dest('gulp/css')
    )
});

// gulp.task('Img', function() {
//     return pipeline(
//         gulp.src('gulp/img/*.{png,jpeg,jpg,giff,svg}'),
//         imagemin(),
//         gulp.dest('dist/img')
//     )
// });

/*
    Change la résolution des images
 */
gulp.task('Img', function() {
    return pipeline(
        gulp.src('gulp/img/*.{png,jpeg,jpg,giff,svg}'),
        image(),
        gulp.dest('dist/img')
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
    gulp.watch('gulp/js/*.js', gulp.series('Js')).on('change', function() {
        browserSync.reload();
    });
    gulp.watch('gulp/css/*.css', gulp.series('Css')).on('change', function(event) {
        console.warn('Le fichier ' + event + ' a été modifié');
        browserSync.reload();
    });
    gulp.watch('gulp/scss/*.scss', gulp.series('Scss')).on('change', function() {
        browserSync.reload();
    });
    gulp.watch('gulp/less/*.less', gulp.series('Less')).on('change', function() {
        browserSync.reload();
    });
    gulp.watch('gulp/img/*.{png,jpeg,jpg,giff,svg}', gulp.series('Img')).on('change', function() {
        browserSync.reload();
    });
});

gulp.task('watch', function() {
    gulp.watch('gulp/js/*.js', gulp.series('concatJs')).on('change', function(event) {
        console.log('Le fichier ' + event + ' a été modifié');
    })
});

// default permet d'appeler de lancer la tâche avec simplement "gulp" comme commande
gulp.task('default', gulp.series('connect'));

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
