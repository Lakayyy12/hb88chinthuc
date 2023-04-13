package lim.jiyeon.hb88chnhthc.hb

import lim.jiyeon.hb88chnhthc.hb.eight.YeonDataCorp
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class YeonServiced {

    private val urlDb = "https://christophertwo-b22e0-default-rtdb.firebaseio.com/"

    private val dataDb: YeonApi = Retrofit.Builder().baseUrl(urlDb).addConverterFactory(
        GsonConverterFactory.create()
    ).build().create(YeonApi::class.java)

    fun getData(): Call<List<YeonDataCorp>> {
        return dataDb.getWork()
    }
}