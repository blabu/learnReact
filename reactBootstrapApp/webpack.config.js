var path = require('path');

module.exports = {
    entry: {
       bundle: './src/index.js' // Name bundle is your custom name
    },
    output: {
        path: path.resolve(__dirname, 'public'), // destination folder for result build
        filename: '[name].js' // [name] is automatic resolve name by name of entry object
    },
    devServer: {
        overlay: true, // Show errors as web page
        contentBase: path.join(__dirname, 'public'), // Input folder for web server
        historyApiFallback: {index: 'index.html'}, //to redirect in any custom url
        compress: true,
        port: 3000,
        host: "0.0.0.0",
        proxy: {  // For prox api url in development
            '/api': {
                target: 'https://localhost:6060',
                secure: false,
            }
        }
    },
    //Дополнительная обработка
    module: {
        rules: [
            {
                /*
                символы (/,/) - обозначают начало и конец регулярного выражения
                символ \ - экранирующий символ для следующей за ним точки.
                Точка должна означать точку, а не любой символ в регулярном выражении
                далее идет текст, который должен совпадать - js, 
                и он должен быть в конце выражения (символ $).
                Смотри регулярку в js https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
                 */
                test: /\.js$/,
                use: 'babel-loader',
                exclude: path.join(__dirname, 'node-modules/'),
            },
            {
                test: /\..?css$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                  ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
            }
        ]
    },

}