# adapted from http://stackoverflow.com/questions/20716842/python-download-images-from-google-image-search
from bs4 import BeautifulSoup
import requests
import re
import urllib2
import os
import argparse
import sys
import json
import logging
import pandas

FORMAT = "[%(levelname)s] %(filename)s::%(funcName)s():%(lineno)s | %(message)s"
logger = logging.getLogger()
logging.basicConfig(stream=sys.stderr, level=logging.DEBUG, format=FORMAT) 

def setLevel(level):
    logger = logging.getLogger()
    logger.setLevel(level)

def get_soup(url, header):
    return BeautifulSoup(urllib2.urlopen(urllib2.Request(url, headers=header)), 'html.parser')

def get_image(path, query, max_images):
    newpath = os.path.join(path, query)
    if not os.path.exists(newpath):
        os.makedirs(newpath)

    image_type = "Action"
    qry = query.split()
    qry = '+'.join(qry)
    url = "https://www.google.com.hk/search?q=" + qry + "&source=lnms&tbm=isch"
    logging.info('attempting query for search term: ['+ query + '] url = ' + url)
    header = {'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"}
    soup = get_soup(url, header)
    ActualImages = []
    for a in soup.find_all("div", {"class":"rg_meta"}):
        link, Type = json.loads(a.text)["ou"], json.loads(a.text)["ity"]
        ActualImages.append((link, Type))
    logging.info('found ' + str(len(ActualImages)) + ' images for this query...getting first ' + str(max_images) + ' images')
    i = 1
    for (img, Type) in ActualImages:
        try:
            req = urllib2.Request(img, headers={'User-Agent': header})
            raw_img = urllib2.urlopen(req).read()
            if len(Type) == 0:
                img_path = os.path.join(newpath, "img" + "_" + str(i) + ".jpg")
            else:
                img_path = os.path.join(newpath, "img" + "_" + str(i) + "." + Type)
            logging.info('  attempting to save file:' + img_path)
            f = open(img_path, 'wb')
            f.write(raw_img)
            f.close()
            i+=1
            if i > max_images:
                break
        except Exception as e:
            logging.error("could not retrieve: " + img)
            logging.error(e)

if __name__ == '__main__':
    setLevel(level=logging.DEBUG)
    parser = argparse.ArgumentParser(description='Scrape Google images')
    parser.add_argument('-n', '--num_images', default=5, type=int, help='num images to save per query')
    parser.add_argument('-p', '--path', default='/mnt/scratch/flowers/images/', type=str, help='data root path')
    parser.add_argument('-f', '--file', default='./query.csv', type=str, help='the universe of flowers in csv format.  uses column `search_term`')
    args = parser.parse_args()
    
    univ = pandas.read_csv(args.file)
    try:
        for q in univ.search_term:
            get_image(args.path, q, args.num_images)
    except KeyboardInterrupt:
        pass
    sys.exit()
