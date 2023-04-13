package lim.jiyeon.hb88chnhthc.hb

import lim.jiyeon.hb88chnhthc.hb.eight.YeonDataCorp
import retrofit2.http.GET

interface YeonApi {
    @GET("HB88CHINHTHUC.json?auth=H9dI3YXHtDRVrgPiVz7g55GpK6oN9NgYbgi2Udmq")
    fun getWork(): retrofit2.Call<List<YeonDataCorp>>
}