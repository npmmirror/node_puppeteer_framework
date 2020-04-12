import Base from './Base'
import ManHuaNiuService from '../../services/Comic/ManHuaNiuService'
import Log from '../../tools/Log'
// import ArrayTool from '../../tools/ArrayTool'
// 模型列表
import ComicData from '../../models/CurlAvatar/Comic/ComicData'
import ComicPageData from '../../models/CurlAvatar/Comic/ComicPageData'
// 缓存
// import PageCache from '../../caches/PageCache'
// 任务结果
const TASK_SUCCESS = true;
const TASK_FALSE = false;

// class ManHuaNiuProcess {
//     static backPageData(one_comic) {
//         const promise = ManHuaNiu.get_images_pages(one_comic)
//         return promise;
//     }
//     static async getNeedData(channel, source_id) {
//         const where = {
//             'channel': channel,
//             'source_id': source_id,
//             'ORDER': { "sequence": "desc" },
//             'LIMIT': 1,
//         }
//         const datas = await Page.select(where)
//         let last_sequence = 0
//         if (0 != datas.length) {
//             const data = datas[0]
//             last_sequence = data.sequence
//         }
//         return last_sequence
//     }
//     static backImageData(link) {
//         const promise = ManHuaNiu.get_images(link)
//         return promise;
//     }
// }

export default class ManHuaNiuLogic extends Base {

    // --------------------------- 新版本 ---------------------------

    /**
     * 自动拉取页面，自动判断是否需要更新
     */
    static async getChapterList(payload) {
        let comic_id = payload.id
        const one_comic = await ComicData.get_comic_by_id(comic_id)
        const last_sequence = one_comic.max_sequence

        const { new_page_data, comic_info } = await ManHuaNiuService.get_images_pages(one_comic)
            .then((info) => {
                let data = []
                let sequence = 0
                for (let i = 0, len = info.hrefs.length; i < len; i++) {
                    let one_data = {
                        'channel': channel,
                        'source_id': info.source_id,
                        'name': info.titles[i],
                        'link': info.hrefs[i],
                        'sequence': (i + 1),
                    }
                    if (one_data.sequence > last_sequence) {
                        data.push(one_data)
                    }
                }
                return { "new_page_data": data, "comic_info": info.detail }
            })

        if (null !== comic_info) {
            await ComicData.updateComicInfo(comic_info, one_comic.id)
            one_comic.name = comic_info.name
        }
        if (0 == new_page_data.length) {
            Log.info(`《${one_comic.name}》---暂无新章节`)
            return TASK_FALSE
        }
        await ComicPageData.insert(new_page_data)
            .then(insert_info => {
                Log.info(`《${one_comic.name}》---添加章节----` + JSON.stringify(insert_info))
            })
        return TASK_SUCCESS
    }

    // --------------------------- 老版本 ---------------------------

    // /**
    //  * 自动拉取页面，自动判断是否需要更新
    //  */
    // static async getPages(channel, one_comic) {
    //     const last_sequence = await ManHuaNiuProcess.getNeedData(channel, one_comic.source_id)
    //     const data = await ManHuaNiuProcess.backPageData(one_comic)
    //         .then((info) => {
    //             let data = []
    //             let sequence = 0
    //             for (let i = 0, len = info.hrefs.length; i < len; i++) {
    //                 let one_data = {
    //                     'channel': channel,
    //                     'source_id': info.source_id,
    //                     'name': info.titles[i],
    //                     'link': info.hrefs[i],
    //                     'sequence': (i + 1),
    //                 }
    //                 if (one_data.sequence > last_sequence) {
    //                     data.push(one_data)
    //                 }
    //             }
    //             return { "page_data": data, "comic_info": info.detail }
    //         })
    //     if (null != data.comic_info) {
    //         await this.updateComicInfo(data.comic_info, one_comic.id)
    //         one_comic.name = data.comic_info.name
    //     }
    //     if (0 == data.page_data.length) {
    //         Log.log(`《${one_comic.name}》---暂无新章节`)
    //         return false
    //     } else {
    //         await Page.insert(data.page_data)
    //             .then(insert_info => {
    //                 Log.log(`《${one_comic.name}》---添加章节----` + JSON.stringify(insert_info))
    //             })
    //     }
    //     return true
    // }
    // /**
    //  * 自动拉取图片
    //  */
    // static async getImageList(channel, one_page) {
    //     let { id, link, source_id, sequence } = one_page
    //     const lock_success = await PageCache.set_data(id, 1, true)
    //     // Log.log(`lock_success ${lock_success}`)
    //     if (!lock_success) {
    //         Log.log(`source_id ${source_id} page ${id} 章节 ${sequence} 已锁定`)
    //         return false
    //     }
    //     await this.saveImageSrcDoing(id)
    //     // Log.log('one_page')
    //     // Log.log(one_page)
    //     const imgs = await ManHuaNiuProcess.backImageData(link)
    //     // Log.log('imgs')
    //     // Log.log(imgs)
    //     if (0 == imgs.length) {
    //         Log.log('暂无新的图片')
    //         return false
    //     }
    //     await this.deleImageData(id)
    //     const datas = this.filterImageList(imgs, id)
    //     // Log.log('datas')
    //     // Log.log(datas)
    //     let _return = false
    //     if (0 == datas.length) {
    //         Log.log('暂无需要拉取的数据')
    //     } else {
    //         _return = true
    //         await Image.insert(datas)
    //             .then(insert_info => {
    //                 Log.log(`source_id ${source_id} page ${id} 章节 ${sequence} 对应图片拉取成功 ${JSON.stringify(insert_info)}`)
    //             })
    //     }
    //     await this.saveImageSrcSuccess(id)
    //     return true
    // }
    // /**
    //  * 清空进行中的任务
    //  */
    // static async clearProcess(channel, pages) {
    //     let page_ids = ArrayTool.column(pages, 'id')
    //     // Log.log('page_ids')
    //     // Log.log(page_ids)
    //     // for(let i in page_ids){
    //     //     let page_id = page_ids[i]
    //     //     await PageCache.set_data(channel +'_' + page_id, 1)
    //     // }
    //     if (page_ids.length > 0) {
    //         await this.saveImageSrcWait(page_ids) // 对应的锁,请手动删除 redis中 对应的key
    //     }
    // }
}