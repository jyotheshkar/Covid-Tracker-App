import { buildChartData } from './chartData';
test('zero is a valid preceding cumulative total',()=>{expect(buildChartData({cases:{a:0,b:3,c:5}},'cases')).toEqual([{x:'b',y:3},{x:'c',y:2}]);});
test('missing series and gaps do not fabricate numbers',()=>{expect(buildChartData({},'deaths')).toEqual([]);expect(buildChartData({cases:{a:2,b:null,c:4,d:6}},'cases')).toEqual([{x:'d',y:2}]);});
