
    "use strict";

    function TestPage( req, res  ){
            res.write("<html><head><title>proxy | codeology</title></head><body>");
            res.write("<h1>proxy.codeology.co.nz</h1>");
            res.write("<form method='post' action='/'>");

            res.write("<label>URI of an api to proxy and cache</label>");
            res.write("<input type='text' name='uri' width='400'>");

            res.write("<label>Password</label>");
            res.write("<input type='password' name='password' width='400'>");

            res.write("<button>Test Post</button>");
            res.write("</form>");
            res.write("</body></html>");
            res.end();

    }

    module.exports = TestPage;