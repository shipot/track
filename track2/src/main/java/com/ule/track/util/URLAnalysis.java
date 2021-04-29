package com.ule.track.util;

import java.util.HashMap;
import java.util.Map;

/**
 * URL 解析工具类
 * 
 * @author mike
 * 
 */
public class URLAnalysis {
	
	public static Map<String, String> analysis(String url) {
		Map<String, String> paramMap = new HashMap<String, String>();
		if (!"".equals(url)) {
			try {
				url =url.replaceAll("=", "=#");
				String paramaters[] = url.split("&");
				for (String param : paramaters) {
					String values[] = param.split("=");
					String p = values[0];
					String v = values[1];
					if ("#".equals(v)) {
						v = " ";
						paramMap.put(p, v);
					} else {
						v = v.replace("#","").trim();
						paramMap.put(p, v);
					}
				}
				if (paramMap != null) {
					return paramMap;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return null;
	}

}
