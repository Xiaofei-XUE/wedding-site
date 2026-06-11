function updateWeddingCars() {
  const cars = document.querySelector('#cars');
  if (!cars) {
    window.setTimeout(updateWeddingCars, 120);
    return;
  }

  const titles = cars.querySelectorAll('.table-title span');
  if (titles[0]) titles[0].textContent = '车队：劳斯莱斯古斯特1辆 + 奔驰E300婚车8辆 + 录像车1辆，共10辆';
  if (titles[1]) titles[1].textContent = '按车辆编号记录每辆车坐谁，后续补司机、车牌和具体上车人员';

  const tables = cars.querySelectorAll('.work-table tbody');
  if (!tables[0] || !tables[1]) return;

  tables[0].innerHTML = `
    <tr><td>1号车 · 劳斯莱斯古斯特</td><td>主婚车</td><td>新郎、新娘</td><td>待补充</td><td>蓝海酒店 → 县城朝阳公园取景 → 绕一圈 → 回婚礼酒店过门</td><td><span class="tag done">主婚车已定</span></td></tr>
    <tr><td>2号车 · 奔驰E300</td><td>跟车</td><td>伴郎/伴娘/随行人员待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>3号车 · 奔驰E300</td><td>跟车</td><td>伴郎/伴娘/随行人员待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>4号车 · 奔驰E300</td><td>跟车</td><td>双方父母/重要亲友待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>5号车 · 奔驰E300</td><td>跟车</td><td>双方父母/重要亲友待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>6号车 · 奔驰E300</td><td>跟车</td><td>男方亲友/工作人员待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>7号车 · 奔驰E300</td><td>跟车</td><td>女方亲友/工作人员待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>8号车 · 奔驰E300</td><td>跟车</td><td>机动亲友待排</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag wait">人员待排</span></td></tr>
    <tr><td>9号车 · 奔驰E300</td><td>跟车/机动</td><td>机动亲友、物料或工作人员</td><td>待补充</td><td>跟随主婚车</td><td><span class="tag progress">机动预留</span></td></tr>
    <tr><td>10号车 · 录像车</td><td>录像与拍摄保障</td><td>录像团队</td><td>待补充</td><td>跟随/提前机位，按摄影摄像需求调整</td><td><span class="tag done">录像车已列入</span></td></tr>
  `;

  tables[1].innerHTML = `
    <tr><td>1号车 · 劳斯莱斯古斯特</td><td>后排</td><td>新郎、新娘</td><td>手捧花、戒指盒等需另确认</td><td><span class="tag risk">确认物品保管人</span></td></tr>
    <tr><td>2号车 · 奔驰E300</td><td>待定</td><td>伴郎/伴娘优先</td><td>堵门红包、婚鞋、急救包、补妆包</td><td><span class="tag wait">座位待排</span></td></tr>
    <tr><td>3号车 · 奔驰E300</td><td>待定</td><td>伴郎/伴娘/随行人员</td><td>随身物品</td><td><span class="tag wait">座位待排</span></td></tr>
    <tr><td>4号车 · 奔驰E300</td><td>待定</td><td>双方父母或重要亲友</td><td>胸花、红包、随身物品</td><td><span class="tag wait">人员待补充</span></td></tr>
    <tr><td>5号车 · 奔驰E300</td><td>待定</td><td>双方父母或重要亲友</td><td>随身物品</td><td><span class="tag wait">人员待补充</span></td></tr>
    <tr><td>6号车 · 奔驰E300</td><td>待定</td><td>男方亲友/工作人员</td><td>备用物料</td><td><span class="tag wait">人员待补充</span></td></tr>
    <tr><td>7号车 · 奔驰E300</td><td>待定</td><td>女方亲友/工作人员</td><td>备用物料</td><td><span class="tag wait">人员待补充</span></td></tr>
    <tr><td>8号车 · 奔驰E300</td><td>待定</td><td>机动亲友</td><td>备用物料</td><td><span class="tag progress">机动</span></td></tr>
    <tr><td>9号车 · 奔驰E300</td><td>待定</td><td>机动亲友/物料</td><td>备用物料</td><td><span class="tag progress">机动</span></td></tr>
    <tr><td>10号车 · 录像车</td><td>待定</td><td>录像团队</td><td>拍摄设备</td><td><span class="tag done">拍摄保障</span></td></tr>
  `;
}

updateWeddingCars();
