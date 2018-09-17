
    function test(){
      alert("test");
    }

    function _submit(){
      form = document.createElement("form");
      document.body.appendChild(form);

      // form.method = "GET";
      form.action = "/";
      form.submit();
    }