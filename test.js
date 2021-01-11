   var dt = [
       // 1.0000
       ["20191129", "0.9926"],
       ["20191206", "1.0039"],
       ["20191213", "1.0149"],
   ];
   var dt2 = [
       // 1.6398
       ["20191129", "1.5973"],
       ["20191206", "1.6309"],
       ["20191213", "1.6526"],
   ];
   var sy = dataDeal(dt);
   console.log(sy);
   var tl = dataDeal(dt2);
   console.log(tl);
   // [1574985600000, -0.74] -2.59%
   // [1575590400000, 0.39]  -0.54%
   // [1576195200000, 1.49]   0.78%

   function dataDeal(a) {
       let arr = [];
       a.forEach((t) => {
           var time = Date.UTC(
                   t[0].substring(0, 4),
                   t[0].substring(4, 6) - 1,
                   t[0].substring(6, 8)
               ),
               s = [time],
               // r = 1;
               r = 1.6398; // 同类平均

           console.log(parseFloat(t[1]));
           console.log(r);

           s[1] = ((parseFloat(t[1]) - r) / r) * 100;
           s[1] = parseFloat(s[1].toFixed(2));

           arr.push(s);
       });
       return arr;
   }