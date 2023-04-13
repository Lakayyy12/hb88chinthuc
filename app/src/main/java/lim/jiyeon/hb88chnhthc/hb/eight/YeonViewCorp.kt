package lim.jiyeon.hb88chnhthc.hb.eight

import android.content.ContentValues
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import lim.jiyeon.hb88chnhthc.hb.YeonServiced
import retrofit2.Call
import retrofit2.Response
import java.util.ArrayList

class YeonViewCorp : ViewModel() {

    private val data = YeonServiced()

    var thisData: ArrayList<YeonDataCorp> = ArrayList<YeonDataCorp>()
    private val getData = MutableLiveData<List<YeonDataCorp>?>()
    val livedataListModel: MutableLiveData<List<YeonDataCorp>?> get() = getData

    fun getData() {
        data.getData().enqueue(object : retrofit2.Callback<List<YeonDataCorp>> {
            override fun onResponse(
                call: Call<List<YeonDataCorp>>,
                response: Response<List<YeonDataCorp>>,
            ) {
                try {
                    val good: List<YeonDataCorp> = response.body()!!
                    for (i in good.indices) {
                        thisData.add(good[i])
                        Log.e(ContentValues.TAG, good.toString())
                    }
                    getData.value = thisData
                    Log.e(ContentValues.TAG, thisData.toString())

                } catch (e: Exception) {
                    getData.value = null
                }
            }

            override fun onFailure(call: Call<List<YeonDataCorp>>, t: Throwable) {
                getData.value = null
            }
        })
    }
}