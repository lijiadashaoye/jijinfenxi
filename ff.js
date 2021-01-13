  this.zhengli.canUse.forEach((t) => {
      if (t.gupiao.length) {
          let gupiao = t.gupiao.map((k) => k.zcCode); // 选出当前基金所持股票的代码
          for (let i = this.zhengli.canUse.length; i--;) {
              let jj = this.zhengli.canUse[i];
              if (
                  // 排除自己且其他基金有股票数据
                  jj.code != t.code &&
                  jj.gupiao.length
              ) {
                  let d = jj.gupiao.map((k) => k.zcCode),
                      num = 0;
                  gupiao.forEach((j) => {
                      if (d.includes(j)) {
                          num++;
                      }
                  });
                  if (num > this.chongheNum) {
                      let a = new Set(t.gupiao.map((d) => d.zcCode)),
                          b = new Set(jj.gupiao.map((d) => d.zcCode)),
                          kk = [...new Set([...a].filter((x) => b.has(x)))],
                          linshi = t.gupiao
                          .filter((t) => kk.includes(t.zcCode))
                          .map((t) => t.zcName),
                          obj = {
                              one: t,
                              oneOther: t.gupiao
                                  .map((d) => d.zcName)
                                  .filter((f) => !linshi.includes(f)),
                              two: jj,
                              twoOther: jj.gupiao
                                  .map((d) => d.zcName)
                                  .filter((f) => !linshi.includes(f)),
                              num: num,
                              chong: linshi,
                          };
                      arrs.push(obj);
                  }
              }
          }
      }
  });