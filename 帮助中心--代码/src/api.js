import qs from 'qs';
export default {

    // 上传图标
    UPImg(data) {
        // 本地测试用
        let imgUpUrl = "http://app-test4.bicai365.com/omp/finsuitFileUpload/forUpload";
        // 生产环境用
        // let imgUpUrl = `${data.vm.$axios.defaults.baseURL}/finsuitFileUpload/forUpload`;

        return data.vm.$axios({
            method: 'post',
            url: imgUpUrl,
            data: data.data
        })
    },

    // 获取页面参数
    getPeiZhi(data) {
        return data.vm.$axios({
            method: 'get',
            url: data.url,
        })
    },

    ///////////////////////////////////////////////////////////

    // 查询入口列表
    getRuKouList(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpEntrance/entrancePageList`,
            data: data.data
        })
    },
    // 根据生效渠道查入口列表
    rukouList(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/helpEntrance/getEntranceByAppflag?appFlag=${data.data}`,
        })
    },

    // 新增帮助中心入口
    rukouAddData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpEntrance/addEntrance`,
            data: data.data
        })
    },
    // 新增帮助中心入口
    rukouUpData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpEntrance/updateEntrance`,
            data: data.data
        })
    },
    // 删除帮助中心入口
    rukouDeleteData(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/helpEntrance/deleteEntrance/${data.data}`,

        })
    },
    ////////////////////////////////////////////////////////
    //  获得问题分类列表
    getFenLeiList(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/questionCategory/questionCategoryPageList`,
            data: data.data
        })
    },

    // 删除自助问题分类
    fenleiDeleteData(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/questionCategory/deleteQuestionCategory/${data.data}`,
        })
    },

    //  新增自助分类
    fenleiAddData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/questionCategory/addQuestionCategory`,
            data: data.data
        })
    },
    //  修改自助分类
    fenleiUpData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/questionCategory/updateQuestionCategory`,
            data: data.data
        })
    },

    /////////////////////////////////////////////////////////////
    // 根据维度获取页面下拉数据
    getYeMianData(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/helpQuestion/forQuestionDimension?dimension=${data.data}`
        })
    },
    //  获取问题列表
    getWenTiList(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpQuestion/questionPageList`,
            data: data.data
        })
    },

    // 删除问题列表
    wenTiDeleteData(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/helpQuestion/deleteQuestion/${data.data}`,
        })
    },

    //  新增问题列表
    wenTiAddData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpQuestion/addQuestion`,
            data: data.data
        })
    },
    //  新增问题列表
    wenTiUpData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/helpQuestion/updateQuestion`,
            data: data.data
        })
    },

    ///////////////////////////////////////////////////////////////

    //  获取问题排序列表
    getPaiXuList(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/questionOrder/questionOrderPageList`,
            data: data.data
        })
    },

    //  修改顺序
    paiXu(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/questionOrder/updateQuestionOrder?${qs.stringify(data.data)}`,
        })
    },

    ///////////////////////////////////////////////////////////////

    //  获取自助客服列表
    getKeFuList(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/onlineService/onlineServicePageList`,
            data: data.data
        })
    },

    // 删除问题列表
    keFuDeleteData(data) {
        return data.vm.$axios({
            method: 'get',
            url: `/onlineService/deleteOnlineService/${data.data}`,
        })
    },


    //  新增客服
    keFuAddData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/onlineService/addOnlineService`,
            data: data.data
        })
    },

    //  修改客服
    keFuUpData(data) {
        return data.vm.$axios({
            method: 'post',
            url: `/onlineService/updateOnlineService`,
            data: data.data
        })
    },




}